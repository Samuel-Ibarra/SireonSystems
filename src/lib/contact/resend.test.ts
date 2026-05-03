import { describe, expect, it } from "vitest";

import {
  buildBookingConfirmationEmailPayload,
  buildBookingNotificationEmailPayload,
  buildContactAutoReplyEmailPayload,
  buildContactEmailPayload,
} from "./email-templates";

describe("buildBookingNotificationEmailPayload", () => {
  it("includes prospect details and calendar links for booked appointments", () => {
    const payload = buildBookingNotificationEmailPayload(
      {
        start: "2026-05-04T09:00:00.000-06:00",
        name: "Carlos Medina",
        email: "carlos@example.com",
        company: "Comercial Delta",
        phone: "+52 81 1234 5678",
        notes: "Queremos automatizar seguimiento de prospectos.",
        website: "",
      },
      {
        id: "abc123",
        htmlLink: "https://calendar.google.com/event?eid=abc123",
        meetLink: "https://meet.google.com/abc-defg-hij",
        start: "2026-05-04T09:00:00.000-06:00",
        end: "2026-05-04T09:30:00.000-06:00",
      },
    );

    expect(payload.subject).toBe(
      "Nueva cita Sireon Systems: Carlos Medina - Comercial Delta",
    );
    expect(payload.reply_to).toBe("carlos@example.com");
    expect(payload.text).toContain("Prospecto: Carlos Medina");
    expect(payload.text).toContain("Email: carlos@example.com");
    expect(payload.text).toContain("Telefono: +52 81 1234 5678");
    expect(payload.text).toContain("Empresa: Comercial Delta");
    expect(payload.text).toContain("Fecha y hora: 4 may 2026, 09:00");
    expect(payload.text).toContain(
      "Evento: https://calendar.google.com/event?eid=abc123",
    );
    expect(payload.text).toContain(
      "Google Meet: https://meet.google.com/abc-defg-hij",
    );
    expect(payload.html).toContain("Carlos Medina");
    expect(payload.html).toContain("https://meet.google.com/abc-defg-hij");
    expect(payload.text).not.toMatch(/\bleads?\b/i);
    expect(payload.html).not.toMatch(/\bleads?\b/i);
  });

  it("builds a formal contact autoresponse for the prospect", () => {
    const payload = buildContactAutoReplyEmailPayload({
      name: "Ana Lopez",
      email: "ana@example.com",
      phone: "+52 55 1234 5678",
      company: "Operadora Norte",
      serviceInterest: "Automatizaciones con IA",
      message: "Quiero reducir tareas manuales en mi equipo comercial.",
      website: "",
    });

    expect(payload.to).toEqual(["ana@example.com"]);
    expect(payload.subject).toBe("Recibimos tu solicitud - Sireon Systems");
    expect(payload.text).toContain("Hola Ana Lopez");
    expect(payload.text).toContain("revisaremos tu caso");
    expect(payload.html).toContain("Recibimos tu solicitud");
    expect(payload.text).not.toMatch(/\bleads?\b/i);
    expect(payload.html).not.toMatch(/\bleads?\b/i);
  });

  it("builds a formal internal contact notification without English lead wording", () => {
    const payload = buildContactEmailPayload({
      name: "Ana Lopez",
      email: "ana@example.com",
      phone: "+52 55 1234 5678",
      company: "Operadora Norte",
      serviceInterest: "Automatizaciones con IA",
      message: "Quiero reducir tareas manuales en mi equipo comercial.",
      website: "",
    });

    expect(payload.subject).toBe(
      "Nueva oportunidad Sireon Systems: Automatizaciones con IA",
    );
    expect(payload.text).toContain("Nueva solicitud desde la landing");
    expect(payload.text).toContain("Prospecto: Ana Lopez");
    expect(payload.html).toContain("Nueva oportunidad");
    expect(payload.text).not.toMatch(/\bleads?\b/i);
    expect(payload.html).not.toMatch(/\bleads?\b/i);
  });

  it("builds a customer booking confirmation with an ICS attachment", () => {
    const payload = buildBookingConfirmationEmailPayload(
      {
        start: "2026-05-04T09:00:00.000-06:00",
        name: "Carlos Medina",
        email: "carlos@example.com",
        company: "Comercial Delta",
        phone: "+52 81 1234 5678",
        notes: "Queremos automatizar seguimiento de prospectos.",
        website: "",
      },
      {
        id: "abc123",
        htmlLink: "https://calendar.google.com/event?eid=abc123",
        meetLink: "https://meet.google.com/abc-defg-hij",
        start: "2026-05-04T09:00:00.000-06:00",
        end: "2026-05-04T09:30:00.000-06:00",
      },
    );

    expect(payload.to).toEqual(["carlos@example.com"]);
    expect(payload.subject).toBe("Confirmacion de cita - Sireon Systems");
    expect(payload.text).toContain("Tu cita quedo confirmada");
    expect(payload.html).toContain("Agregar a tu calendario");
    expect(payload.attachments).toHaveLength(1);
    expect(payload.attachments?.[0]?.filename).toBe("cita-sireon-systems.ics");
    expect(payload.attachments?.[0]?.content).toContain("QkVHSU46VkNBTEVOREFS");
  });
});
