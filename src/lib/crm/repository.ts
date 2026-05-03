import type { BookingRequestData } from "@/lib/calendar/booking";
import type { CalendarEventSummary } from "@/lib/contact/email-templates";
import type { ContactFormData } from "@/lib/contact/schema";
import { getSupabaseServerClient } from "./supabase";

type QueryResult<T> = Promise<{ data: T | null; error: { message: string } | null }>;

type InsertBuilder<T> = {
  select: (columns?: string) => {
    single: () => QueryResult<T>;
  };
};

type UpdateBuilder = {
  eq: (column: string, value: string) => Promise<{
    data: unknown;
    error: { message: string } | null;
  }>;
};

export type SupabaseRepositoryClient = {
  from: (table: string) => {
    insert: <T = { id: string }>(payload: unknown) => InsertBuilder<T>;
    update: (payload: unknown) => UpdateBuilder;
  };
};

type IdRow = {
  id: string;
};

export type EmailEventInput = {
  opportunityId?: string;
  appointmentId?: string;
  whatsappConversationId?: string;
  recipient: string;
  subject: string;
  template: string;
  status: "sent" | "failed";
  providerMessageId?: string;
  errorMessage?: string;
};

function getRepositoryClient(): SupabaseRepositoryClient {
  return getSupabaseServerClient() as unknown as SupabaseRepositoryClient;
}

export async function createContactOpportunity(
  data: ContactFormData,
  sourceOrClient: string | SupabaseRepositoryClient = "contact_form",
  maybeClient?: SupabaseRepositoryClient,
) {
  const source =
    typeof sourceOrClient === "string" ? sourceOrClient : "contact_form";
  const client =
    typeof sourceOrClient === "string"
      ? (maybeClient ?? getRepositoryClient())
      : sourceOrClient;
  const row = {
    source,
    status: "new",
    prospect_name: data.name,
    prospect_email: data.email,
    prospect_phone: data.phone || null,
    company: data.company || null,
    service_interest: data.serviceInterest,
    message: data.message,
    metadata: {
      website: data.website,
    },
  };

  const result = await client
    .from("opportunities")
    .insert<IdRow>(row)
    .select("id")
    .single();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return { id: result.data?.id ?? "" };
}

export async function createAppointmentRequest(
  data: BookingRequestData,
  client: SupabaseRepositoryClient = getRepositoryClient(),
) {
  const opportunity = await client
    .from("opportunities")
    .insert<IdRow>({
      source: "calendar_booking",
      status: "appointment_requested",
      prospect_name: data.name,
      prospect_email: data.email,
      prospect_phone: data.phone || null,
      company: data.company || null,
      service_interest: "Diagnostico general",
      message: data.notes || "Solicitud de cita desde agenda.",
      metadata: {
        website: data.website,
      },
    })
    .select("id")
    .single();

  if (opportunity.error) {
    throw new Error(opportunity.error.message);
  }

  const appointment = await client
    .from("appointments")
    .insert<IdRow>({
      opportunity_id: opportunity.data?.id,
      status: "pending",
      prospect_name: data.name,
      prospect_email: data.email,
      prospect_phone: data.phone || null,
      company: data.company || null,
      start_at: data.start,
      notes: data.notes || null,
    })
    .select("id")
    .single();

  if (appointment.error) {
    throw new Error(appointment.error.message);
  }

  return {
    opportunityId: opportunity.data?.id ?? "",
    appointmentId: appointment.data?.id ?? "",
  };
}

export async function updateAppointmentConfirmation(
  appointmentId: string,
  event: CalendarEventSummary,
  client: SupabaseRepositoryClient = getRepositoryClient(),
) {
  const result = await client.from("appointments").update({
    status: "confirmed",
    google_event_id: event.id,
    google_event_link: event.htmlLink || null,
    google_meet_link: event.meetLink || null,
    start_at: event.start,
    end_at: event.end,
  }).eq("id", appointmentId);

  if (result.error) {
    throw new Error(result.error.message);
  }
}

export async function recordEmailEvent(
  input: EmailEventInput,
  client: SupabaseRepositoryClient = getRepositoryClient(),
) {
  const result = await client
    .from("email_events")
    .insert({
      opportunity_id: input.opportunityId ?? null,
      appointment_id: input.appointmentId ?? null,
      whatsapp_conversation_id: input.whatsappConversationId ?? null,
      recipient: input.recipient,
      subject: input.subject,
      template: input.template,
      status: input.status,
      provider_message_id: input.providerMessageId ?? null,
      error_message: input.errorMessage ?? null,
    })
    .select("id")
    .single();

  if (result.error) {
    throw new Error(result.error.message);
  }
}
