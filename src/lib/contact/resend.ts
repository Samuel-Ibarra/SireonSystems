import "server-only";

import type { BookingRequestData } from "@/lib/calendar/booking";
import { requiredEnv } from "@/lib/env";
import {
  buildBookingConfirmationEmailPayload,
  buildBookingNotificationEmailPayload,
  buildContactAutoReplyEmailPayload,
  buildContactEmailPayload,
  type CalendarEventSummary,
  type EmailPayload,
} from "./email-templates";
import type { ContactFormData } from "./schema";

type ResendResponse = {
  id?: string;
  message?: string;
};

export async function sendContactEmail(data: ContactFormData) {
  return sendEmail(buildContactEmailPayload(data));
}

export async function sendContactAutoReplyEmail(data: ContactFormData) {
  return sendEmail(buildContactAutoReplyEmailPayload(data));
}

export async function sendBookingNotificationEmail(
  booking: BookingRequestData,
  event: CalendarEventSummary,
) {
  return sendEmail(buildBookingNotificationEmailPayload(booking, event));
}

export async function sendBookingConfirmationEmail(
  booking: BookingRequestData,
  event: CalendarEventSummary,
) {
  return sendEmail(buildBookingConfirmationEmailPayload(booking, event));
}

async function sendEmail(email: EmailPayload) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requiredEnv("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: requiredEnv("CONTACT_FROM_EMAIL"),
      to: email.to ?? [requiredEnv("CONTACT_TO_EMAIL")],
      subject: email.subject,
      reply_to: email.reply_to,
      text: email.text,
      html: email.html,
      attachments: email.attachments,
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as ResendResponse;

  if (!response.ok) {
    throw new Error(payload.message ?? "No fue posible enviar el correo.");
  }

  return {
    id: payload.id ?? "",
  };
}
