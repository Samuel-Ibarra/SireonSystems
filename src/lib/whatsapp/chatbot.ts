import type { BookingRequestData } from "@/lib/calendar/booking";
import type { AvailabilitySlot } from "@/lib/calendar/availability";
import type { CalendarEventSummary } from "@/lib/contact/email-templates";
import type { ContactFormData } from "@/lib/contact/schema";

export type WhatsappInboundMessage = {
  messageId: string;
  from: string;
  profileName: string;
  text: string;
};

export type ConversationState =
  | "new"
  | "menu"
  | "quote_name"
  | "quote_company"
  | "quote_service"
  | "quote_need"
  | "quote_email"
  | "quote_phone"
  | "schedule_name"
  | "schedule_company"
  | "schedule_email"
  | "schedule_notes"
  | "schedule_slot"
  | "handoff";

type Conversation = {
  id: string;
  state: ConversationState;
  collectedData: Record<string, unknown>;
};

export type WhatsappChatbotDependencies = {
  loadConversation: (input: WhatsappInboundMessage) => Promise<Conversation>;
  saveConversation: (
    updates: Partial<Conversation> & { status?: string },
  ) => Promise<void>;
  saveInboundMessage: (
    input: WhatsappInboundMessage,
    conversationId: string,
  ) => Promise<{ duplicated: boolean }>;
  sendMessage: (phone: string, text: string) => Promise<void>;
  createOpportunity: (data: ContactFormData) => Promise<{ id: string }>;
  getAvailableSlots: () => Promise<AvailabilitySlot[]>;
  bookAppointment: (data: BookingRequestData) => Promise<CalendarEventSummary>;
};

export async function handleWhatsappText(
  input: WhatsappInboundMessage,
  dependencies: WhatsappChatbotDependencies,
) {
  const conversation = await dependencies.loadConversation(input);
  const inbound = await dependencies.saveInboundMessage(input, conversation.id);

  if (inbound.duplicated) {
    return;
  }

  const text = input.text.trim();
  const normalized = text.toLowerCase();

  if (conversation.state === "new" || normalized === "menu") {
    await dependencies.saveConversation({ state: "menu" });
    await dependencies.sendMessage(input.from, buildMenuMessage(input.profileName));
    return;
  }

  if (conversation.state === "menu") {
    if (text === "1") {
      await dependencies.saveConversation({
        state: "quote_name",
        collectedData: {},
      });
      await dependencies.sendMessage(
        input.from,
        "Con gusto. Para preparar tu solicitud, ¿cuál es tu nombre completo?",
      );
      return;
    }

    if (text === "2") {
      await dependencies.saveConversation({
        state: "schedule_name",
        collectedData: {},
      });
      await dependencies.sendMessage(
        input.from,
        "Claro. Para agendar tu diagnóstico, ¿cuál es tu nombre completo?",
      );
      return;
    }

    if (text === "3") {
      await dependencies.saveConversation({
        state: "handoff",
        status: "needs_human",
      });
      await dependencies.sendMessage(
        input.from,
        "Gracias. Una persona de nuestro equipo revisará tu mensaje y se pondrá en contacto contigo en cuanto sea posible.",
      );
      return;
    }

    await dependencies.sendMessage(input.from, buildMenuMessage(input.profileName));
    return;
  }

  if (conversation.state.startsWith("quote_")) {
    await handleQuoteFlow(input, conversation, dependencies);
    return;
  }

  if (conversation.state.startsWith("schedule_")) {
    await handleScheduleFlow(input, conversation, dependencies);
  }
}

async function handleQuoteFlow(
  input: WhatsappInboundMessage,
  conversation: Conversation,
  dependencies: WhatsappChatbotDependencies,
) {
  const collectedData = { ...conversation.collectedData };
  const text = input.text.trim();

  if (conversation.state === "quote_name") {
    collectedData.name = text;
    await dependencies.saveConversation({ state: "quote_company", collectedData });
    await dependencies.sendMessage(input.from, "Gracias. ¿Cuál es el nombre de tu empresa?");
    return;
  }

  if (conversation.state === "quote_company") {
    collectedData.company = text;
    await dependencies.saveConversation({ state: "quote_service", collectedData });
    await dependencies.sendMessage(
      input.from,
      "¿Qué necesitas cotizar? Puedes responder: sitio web, landing page, automatización, chatbot o integración.",
    );
    return;
  }

  if (conversation.state === "quote_service") {
    collectedData.serviceInterest = text;
    await dependencies.saveConversation({ state: "quote_need", collectedData });
    await dependencies.sendMessage(
      input.from,
      "Cuéntanos brevemente qué quieres mejorar o automatizar.",
    );
    return;
  }

  if (conversation.state === "quote_need") {
    collectedData.message = text;
    await dependencies.saveConversation({ state: "quote_email", collectedData });
    await dependencies.sendMessage(input.from, "¿A qué correo podemos responderte?");
    return;
  }

  if (conversation.state === "quote_email") {
    collectedData.email = text;
    await dependencies.saveConversation({ state: "quote_phone", collectedData });
    await dependencies.sendMessage(
      input.from,
      "Por último, compártenos un teléfono de contacto.",
    );
    return;
  }

  const opportunity = await dependencies.createOpportunity({
    name: String(collectedData.name ?? input.profileName),
    email: String(collectedData.email ?? ""),
    phone: text,
    company: String(collectedData.company ?? ""),
    serviceInterest: String(collectedData.serviceInterest ?? "Solicitud por WhatsApp"),
    message: String(collectedData.message ?? "Solicitud recibida por WhatsApp."),
    website: "",
  });

  await dependencies.saveConversation({
    state: "menu",
    status: "open",
    collectedData: { opportunityId: opportunity.id },
  });
  await dependencies.sendMessage(
    input.from,
    "Gracias, registramos tu solicitud. Revisaremos tu caso y nos pondremos en contacto contigo con el siguiente paso.",
  );
}

async function handleScheduleFlow(
  input: WhatsappInboundMessage,
  conversation: Conversation,
  dependencies: WhatsappChatbotDependencies,
) {
  const collectedData = { ...conversation.collectedData };
  const text = input.text.trim();

  if (conversation.state === "schedule_name") {
    collectedData.name = text;
    await dependencies.saveConversation({ state: "schedule_company", collectedData });
    await dependencies.sendMessage(input.from, "¿Cuál es el nombre de tu empresa?");
    return;
  }

  if (conversation.state === "schedule_company") {
    collectedData.company = text;
    await dependencies.saveConversation({ state: "schedule_email", collectedData });
    await dependencies.sendMessage(input.from, "¿A qué correo enviamos la invitación?");
    return;
  }

  if (conversation.state === "schedule_email") {
    collectedData.email = text;
    await dependencies.saveConversation({ state: "schedule_notes", collectedData });
    await dependencies.sendMessage(
      input.from,
      "En una frase, ¿qué te gustaría revisar en el diagnóstico?",
    );
    return;
  }

  if (conversation.state === "schedule_notes") {
    const slots = (await dependencies.getAvailableSlots()).slice(0, 3);
    collectedData.notes = text;
    collectedData.slots = slots;
    await dependencies.saveConversation({ state: "schedule_slot", collectedData });
    await dependencies.sendMessage(input.from, buildSlotsMessage(slots));
    return;
  }

  const slots = Array.isArray(collectedData.slots)
    ? (collectedData.slots as AvailabilitySlot[])
    : [];
  const selectedSlot = slots[Number(text) - 1];

  if (!selectedSlot) {
    await dependencies.sendMessage(
      input.from,
      "No encontramos esa opción. Responde con el número del horario que prefieres.",
    );
    return;
  }

  await dependencies.bookAppointment({
    start: selectedSlot.start,
    name: String(collectedData.name ?? input.profileName),
    email: String(collectedData.email ?? ""),
    company: String(collectedData.company ?? ""),
    phone: input.from,
    notes: String(collectedData.notes ?? ""),
    website: "",
  });
  await dependencies.saveConversation({
    state: "menu",
    status: "open",
    collectedData: {},
  });
  await dependencies.sendMessage(
    input.from,
    "Tu cita quedó solicitada. Enviaremos la confirmación y los datos del calendario al correo que compartiste.",
  );
}

function buildMenuMessage(name: string) {
  return [
    `Hola ${name || "gracias por escribirnos"}. Gracias por escribir a Sireon Systems.`,
    "¿Cómo podemos ayudarte?",
    "",
    "1. Cotizar",
    "2. Agendar cita",
    "3. Hablar con una persona",
    "",
    "Responde con el número de la opción que prefieras.",
  ].join("\n");
}

function buildSlotsMessage(slots: AvailabilitySlot[]) {
  if (slots.length === 0) {
    return "Por ahora no encontramos horarios disponibles. Una persona de nuestro equipo revisará tu solicitud.";
  }

  return [
    "Estos son los próximos horarios disponibles:",
    "",
    ...slots.map((slot, index) => `${index + 1}. ${slot.date} ${slot.label}`),
    "",
    "Responde con el número del horario que prefieres.",
  ].join("\n");
}
