import { describe, expect, it, vi } from "vitest";

import { handleWhatsappText } from "./chatbot";

function createMemoryState(initialState = "menu") {
  const conversation = {
    id: "conversation-id",
    state: initialState,
    collectedData: {},
  };
  const messages: string[] = [];

  return {
    messages,
    dependencies: {
      loadConversation: vi.fn(async () => conversation),
      saveConversation: vi.fn(async (updates) => {
        Object.assign(conversation, updates);
      }),
      saveInboundMessage: vi.fn(async () => ({ duplicated: false })),
      sendMessage: vi.fn(async (_phone: string, text: string) => {
        messages.push(text);
      }),
      createOpportunity: vi.fn(async () => ({ id: "opportunity-id" })),
      getAvailableSlots: vi.fn(async () => [
        {
          start: "2026-05-04T09:00:00.000-06:00",
          end: "2026-05-04T09:30:00.000-06:00",
          date: "2026-05-04",
          label: "09:00",
        },
      ]),
      bookAppointment: vi.fn(async () => ({
        id: "abc123",
        htmlLink: "https://calendar.google.com/event?eid=abc123",
        meetLink: "https://meet.google.com/abc-defg-hij",
        start: "2026-05-04T09:00:00.000-06:00",
        end: "2026-05-04T09:30:00.000-06:00",
      })),
    },
  };
}

describe("handleWhatsappText", () => {
  it("sends a guided menu for a new WhatsApp conversation", async () => {
    const memory = createMemoryState("new");

    await handleWhatsappText(
      {
        messageId: "wamid.1",
        from: "528112345678",
        profileName: "Ana",
        text: "Hola",
      },
      memory.dependencies,
    );

    expect(memory.messages[0]).toContain("Gracias por escribir a Sireon Systems");
    expect(memory.messages[0]).toContain("1. Cotizar");
    expect(memory.messages[0]).not.toMatch(/\bleads?\b/i);
  });

  it("captures a quote request and creates an opportunity", async () => {
    const memory = createMemoryState("quote_phone");
    await memory.dependencies.saveConversation({
      collectedData: {
        name: "Ana Lopez",
        company: "Operadora Norte",
        serviceInterest: "Automatizaciones con IA",
        message: "Quiero automatizar seguimiento de prospectos.",
        email: "ana@example.com",
      },
    });

    await handleWhatsappText(
      {
        messageId: "wamid.2",
        from: "528112345678",
        profileName: "Ana",
        text: "+52 81 1234 5678",
      },
      memory.dependencies,
    );

    expect(memory.dependencies.createOpportunity).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Ana Lopez",
        email: "ana@example.com",
        phone: "+52 81 1234 5678",
        serviceInterest: "Automatizaciones con IA",
      }),
    );
    expect(memory.messages.at(-1)).toContain("registramos tu solicitud");
    expect(memory.messages.at(-1)).not.toMatch(/\bleads?\b/i);
  });

  it("marks the conversation for human follow-up", async () => {
    const memory = createMemoryState("menu");

    await handleWhatsappText(
      {
        messageId: "wamid.3",
        from: "528112345678",
        profileName: "Ana",
        text: "3",
      },
      memory.dependencies,
    );

    expect(memory.dependencies.saveConversation).toHaveBeenCalledWith(
      expect.objectContaining({ status: "needs_human", state: "handoff" }),
    );
    expect(memory.messages[0]).toContain("Una persona de nuestro equipo");
  });
});
