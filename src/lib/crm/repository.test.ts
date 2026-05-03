import { describe, expect, it, vi } from "vitest";

import {
  createAppointmentRequest,
  createContactOpportunity,
  recordEmailEvent,
  updateAppointmentConfirmation,
} from "./repository";

function createSupabaseMock() {
  const operations: Array<{
    table: string;
    type: "insert" | "update";
    payload: unknown;
  }> = [];

  return {
    operations,
    client: {
      from: vi.fn((table: string) => ({
        insert: vi.fn((payload: unknown) => {
          operations.push({ table, type: "insert", payload });
          return {
            select: vi.fn(() => ({
              single: vi.fn(async () => ({
                data: { id: `${table}-id` },
                error: null,
              })),
            })),
          };
        }),
        update: vi.fn((payload: unknown) => {
          operations.push({ table, type: "update", payload });
          return {
            eq: vi.fn(async () => ({ data: null, error: null })),
          };
        }),
      })),
    },
  };
}

describe("crm repository", () => {
  it("stores contact submissions as opportunities", async () => {
    const supabase = createSupabaseMock();

    const result = await createContactOpportunity(
      {
        name: "Ana Lopez",
        email: "ana@example.com",
        phone: "+52 55 1234 5678",
        company: "Operadora Norte",
        serviceInterest: "Automatizaciones con IA",
        message: "Quiero reducir tareas manuales en mi equipo comercial.",
        website: "",
      },
      supabase.client,
    );

    expect(result.id).toBe("opportunities-id");
    expect(supabase.operations[0]).toMatchObject({
      table: "opportunities",
      type: "insert",
      payload: {
        source: "contact_form",
        status: "new",
        prospect_name: "Ana Lopez",
        prospect_email: "ana@example.com",
        service_interest: "Automatizaciones con IA",
      },
    });
  });

  it("stores appointment requests and later confirms calendar details", async () => {
    const supabase = createSupabaseMock();

    const result = await createAppointmentRequest(
      {
        start: "2026-05-04T09:00:00.000-06:00",
        name: "Carlos Medina",
        email: "carlos@example.com",
        company: "Comercial Delta",
        phone: "+52 81 1234 5678",
        notes: "Queremos automatizar seguimiento de prospectos.",
        website: "",
      },
      supabase.client,
    );

    await updateAppointmentConfirmation(
      result.appointmentId,
      {
        id: "abc123",
        htmlLink: "https://calendar.google.com/event?eid=abc123",
        meetLink: "https://meet.google.com/abc-defg-hij",
        start: "2026-05-04T09:00:00.000-06:00",
        end: "2026-05-04T09:30:00.000-06:00",
      },
      supabase.client,
    );

    expect(result).toEqual({
      opportunityId: "opportunities-id",
      appointmentId: "appointments-id",
    });
    expect(supabase.operations).toContainEqual(
      expect.objectContaining({
        table: "appointments",
        type: "update",
        payload: expect.objectContaining({
          status: "confirmed",
          google_event_id: "abc123",
          google_meet_link: "https://meet.google.com/abc-defg-hij",
        }),
      }),
    );
  });

  it("records email delivery attempts", async () => {
    const supabase = createSupabaseMock();

    await recordEmailEvent(
      {
        opportunityId: "opportunities-id",
        appointmentId: "appointments-id",
        recipient: "ana@example.com",
        subject: "Recibimos tu solicitud - Sireon Systems",
        template: "contact_auto_reply",
        status: "sent",
        providerMessageId: "email-id",
      },
      supabase.client,
    );

    expect(supabase.operations[0]).toMatchObject({
      table: "email_events",
      type: "insert",
      payload: {
        opportunity_id: "opportunities-id",
        appointment_id: "appointments-id",
        recipient: "ana@example.com",
        template: "contact_auto_reply",
        status: "sent",
        provider_message_id: "email-id",
      },
    });
  });
});
