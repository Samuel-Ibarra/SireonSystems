import { NextResponse } from "next/server";

import {
  createBookingRules,
  generateAvailableSlots,
  isSlotAvailable,
} from "@/lib/calendar/availability";
import { type BookingRequestData } from "@/lib/calendar/booking";
import {
  createDiagnosticEvent,
  getCalendarBusyBlocks,
} from "@/lib/calendar/google";
import {
  sendBookingConfirmationEmail,
  sendBookingNotificationEmail,
  sendContactAutoReplyEmail,
  sendContactEmail,
} from "@/lib/contact/resend";
import type { ContactFormData } from "@/lib/contact/schema";
import {
  createAppointmentRequest,
  createContactOpportunity,
  updateAppointmentConfirmation,
} from "@/lib/crm/repository";
import { requiredEnv } from "@/lib/env";
import { handleWhatsappText, type WhatsappInboundMessage } from "@/lib/whatsapp/chatbot";
import { sendWhatsappTextMessage } from "@/lib/whatsapp/meta";
import {
  loadOrCreateWhatsappConversation,
  saveInboundWhatsappMessage,
  saveOutboundWhatsappMessage,
  saveWhatsappConversation,
} from "@/lib/whatsapp/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === requiredEnv("WHATSAPP_VERIFY_TOKEN")) {
    return new Response(challenge ?? "", { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const messages = extractIncomingMessages(payload);

  await Promise.all(
    messages.map((message) =>
      handleWhatsappText(message, {
        loadConversation: loadOrCreateWhatsappConversation,
        saveInboundMessage: saveInboundWhatsappMessage,
        saveConversation: async (updates) => {
          const conversation = await loadOrCreateWhatsappConversation(message);
          await saveWhatsappConversation(conversation.id, updates);
        },
        sendMessage: async (phone, text) => {
          const conversation = await loadOrCreateWhatsappConversation(message);
          const result = await sendWhatsappTextMessage(phone, text);
          await saveOutboundWhatsappMessage({
            conversationId: conversation.id,
            to: phone,
            body: text,
            providerMessageId: result.id,
          });
        },
        createOpportunity: createOpportunityFromWhatsapp,
        getAvailableSlots: getWhatsappAvailableSlots,
        bookAppointment: bookAppointmentFromWhatsapp,
      }),
    ),
  );

  return NextResponse.json({ received: true });
}

async function createOpportunityFromWhatsapp(data: ContactFormData) {
  const opportunity = await createContactOpportunity(data, "whatsapp");
  await Promise.allSettled([
    sendContactEmail(data),
    sendContactAutoReplyEmail(data),
  ]);
  return opportunity;
}

async function getWhatsappAvailableSlots() {
  const rules = createBookingRules();
  const busy = await getCalendarBusyBlocks({ rules });
  return generateAvailableSlots({ busy, rules });
}

async function bookAppointmentFromWhatsapp(data: BookingRequestData) {
  const rules = createBookingRules();
  const busy = await getCalendarBusyBlocks({
    nowIso: data.start,
    rules,
  });
  const available = isSlotAvailable({
    startIso: data.start,
    busy,
    rules,
  });

  if (!available) {
    throw new Error("El horario seleccionado ya no está disponible.");
  }

  const record = await createAppointmentRequest(data);
  const event = await createDiagnosticEvent(data, rules);
  await updateAppointmentConfirmation(record.appointmentId, event);
  await Promise.allSettled([
    sendBookingNotificationEmail(data, event),
    sendBookingConfirmationEmail(data, event),
  ]);
  return event;
}

function extractIncomingMessages(payload: unknown): WhatsappInboundMessage[] {
  const entries = getArray(payload, "entry");

  return entries.flatMap((entry) =>
    getArray(entry, "changes").flatMap((change) => {
      const value = getObject(change, "value");
      const contacts = getArray(value, "contacts");
      const messages = getArray(value, "messages");

      return messages.flatMap((message) => {
        const type = getString(message, "type");
        const text =
          type === "text" ? getString(getObject(message, "text"), "body") : "";

        if (!text) {
          return [];
        }

        const from = getString(message, "from");
        const contact = contacts.find(
          (item) => getString(item, "wa_id") === from,
        );
        const profileName = getString(getObject(contact, "profile"), "name");

        return [
          {
            messageId: getString(message, "id"),
            from,
            profileName,
            text,
          },
        ];
      });
    }),
  );
}

function getArray(value: unknown, key: string): unknown[] {
  if (!value || typeof value !== "object") {
    return [];
  }

  const item = (value as Record<string, unknown>)[key];
  return Array.isArray(item) ? item : [];
}

function getObject(value: unknown, key: string): Record<string, unknown> {
  if (!value || typeof value !== "object") {
    return {};
  }

  const item = (value as Record<string, unknown>)[key];
  return item && typeof item === "object" && !Array.isArray(item)
    ? (item as Record<string, unknown>)
    : {};
}

function getString(value: unknown, key: string): string {
  if (!value || typeof value !== "object") {
    return "";
  }

  const item = (value as Record<string, unknown>)[key];
  return typeof item === "string" ? item : "";
}
