import { DateTime } from "luxon";

import type { BookingRequestData } from "@/lib/calendar/booking";
import type { ContactFormData } from "./schema";

export type CalendarEventSummary = {
  id: string;
  htmlLink: string;
  meetLink: string;
  start: string | null;
  end: string | null;
};

export type EmailPayload = {
  to?: string[];
  subject: string;
  reply_to: string;
  text: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: string;
    content_type?: string;
  }>;
};

export function buildContactEmailPayload(data: ContactFormData): EmailPayload {
  return {
    subject: `Nueva oportunidad Sireon Systems: ${data.serviceInterest}`,
    reply_to: data.email,
    text: buildContactPlainTextEmail(data),
    html: buildContactHtmlEmail(data),
  };
}

export function buildContactAutoReplyEmailPayload(
  data: ContactFormData,
): EmailPayload {
  return {
    to: [data.email],
    subject: "Recibimos tu solicitud - Sireon Systems",
    reply_to: "contacto@sireonsystems.com",
    text: buildContactAutoReplyPlainTextEmail(data),
    html: buildContactAutoReplyHtmlEmail(data),
  };
}

export function buildBookingNotificationEmailPayload(
  booking: BookingRequestData,
  event: CalendarEventSummary,
): EmailPayload {
  const company = booking.company ? ` - ${booking.company}` : "";
  const appointmentTime = formatAppointmentTime(event.start ?? booking.start);

  return {
    subject: `Nueva cita Sireon Systems: ${booking.name}${company}`,
    reply_to: booking.email,
    text: buildBookingPlainTextEmail(booking, event, appointmentTime),
    html: buildBookingHtmlEmail(booking, event, appointmentTime),
  };
}

export function buildBookingConfirmationEmailPayload(
  booking: BookingRequestData,
  event: CalendarEventSummary,
): EmailPayload {
  const appointmentTime = formatAppointmentTime(event.start ?? booking.start);

  return {
    to: [booking.email],
    subject: "Confirmacion de cita - Sireon Systems",
    reply_to: "contacto@sireonsystems.com",
    text: buildBookingConfirmationPlainTextEmail(
      booking,
      event,
      appointmentTime,
    ),
    html: buildBookingConfirmationHtmlEmail(booking, event, appointmentTime),
    attachments: [
      {
        filename: "cita-sireon-systems.ics",
        content: toBase64(buildCalendarInvite(booking, event)),
        content_type: "text/calendar; charset=utf-8; method=REQUEST",
      },
    ],
  };
}

function buildContactPlainTextEmail(data: ContactFormData): string {
  return [
    "Nueva solicitud desde la landing de Sireon Systems",
    "",
    `Prospecto: ${data.name}`,
    `Email: ${data.email}`,
    `Telefono: ${data.phone || "No indicado"}`,
    `Empresa: ${data.company || "No indicada"}`,
    `Servicio: ${data.serviceInterest}`,
    "",
    "Mensaje:",
    data.message,
  ].join("\n");
}

function buildContactHtmlEmail(data: ContactFormData): string {
  return `
    <div style="font-family: Arial, sans-serif; color: #0B1F3A; line-height: 1.5;">
      <h1 style="font-size: 22px;">Nueva oportunidad desde Sireon Systems</h1>
      <p><strong>Prospecto:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Telefono:</strong> ${escapeHtml(data.phone || "No indicado")}</p>
      <p><strong>Empresa:</strong> ${escapeHtml(data.company || "No indicada")}</p>
      <p><strong>Servicio:</strong> ${escapeHtml(data.serviceInterest)}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${escapeHtml(data.message).replace(/\n/g, "<br />")}</p>
    </div>
  `;
}

function buildContactAutoReplyPlainTextEmail(data: ContactFormData): string {
  return [
    `Hola ${data.name},`,
    "",
    "Gracias por contactar a Sireon Systems. Recibimos tu solicitud y revisaremos tu caso con atención.",
    "En cuanto tengamos una respuesta o recomendación inicial, nos pondremos en contacto contigo por este medio o por teléfono.",
    "",
    "Resumen de tu solicitud:",
    `Servicio de interés: ${data.serviceInterest}`,
    data.company ? `Empresa: ${data.company}` : "",
    "",
    "Saludos,",
    "Equipo de Sireon Systems",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function buildContactAutoReplyHtmlEmail(data: ContactFormData): string {
  return `
    <div style="font-family: Arial, sans-serif; color: #0B1F3A; line-height: 1.6;">
      <h1 style="font-size: 22px;">Recibimos tu solicitud</h1>
      <p>Hola ${escapeHtml(data.name)},</p>
      <p>Gracias por contactar a <strong>Sireon Systems</strong>. Recibimos tu solicitud y revisaremos tu caso con atenci&oacute;n.</p>
      <p>En cuanto tengamos una respuesta o recomendaci&oacute;n inicial, nos pondremos en contacto contigo por este medio o por tel&eacute;fono.</p>
      <div style="margin: 20px 0; padding: 16px; border: 1px solid #D8E3F0; border-radius: 8px; background: #F7FAFC;">
        <p style="margin: 0;"><strong>Servicio de inter&eacute;s:</strong> ${escapeHtml(data.serviceInterest)}</p>
        ${
          data.company
            ? `<p style="margin: 8px 0 0;"><strong>Empresa:</strong> ${escapeHtml(data.company)}</p>`
            : ""
        }
      </div>
      <p>Saludos,<br />Equipo de Sireon Systems</p>
    </div>
  `;
}

function buildBookingPlainTextEmail(
  booking: BookingRequestData,
  event: CalendarEventSummary,
  appointmentTime: string,
): string {
  return [
    "Nueva cita agendada desde la landing de Sireon Systems",
    "",
    `Prospecto: ${booking.name}`,
    `Email: ${booking.email}`,
    `Telefono: ${booking.phone || "No indicado"}`,
    `Empresa: ${booking.company || "No indicada"}`,
    `Fecha y hora: ${appointmentTime}`,
    event.htmlLink ? `Evento: ${event.htmlLink}` : "",
    event.meetLink ? `Google Meet: ${event.meetLink}` : "",
    "",
    "Notas:",
    booking.notes || "Sin notas",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function buildBookingHtmlEmail(
  booking: BookingRequestData,
  event: CalendarEventSummary,
  appointmentTime: string,
): string {
  return `
    <div style="font-family: Arial, sans-serif; color: #0B1F3A; line-height: 1.5;">
      <h1 style="font-size: 22px;">Nueva cita agendada</h1>
      <p><strong>Prospecto:</strong> ${escapeHtml(booking.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(booking.email)}</p>
      <p><strong>Telefono:</strong> ${escapeHtml(booking.phone || "No indicado")}</p>
      <p><strong>Empresa:</strong> ${escapeHtml(booking.company || "No indicada")}</p>
      <p><strong>Fecha y hora:</strong> ${escapeHtml(appointmentTime)}</p>
      ${
        event.htmlLink
          ? `<p><strong>Evento:</strong> <a href="${escapeHtml(event.htmlLink)}">${escapeHtml(event.htmlLink)}</a></p>`
          : ""
      }
      ${
        event.meetLink
          ? `<p><strong>Google Meet:</strong> <a href="${escapeHtml(event.meetLink)}">${escapeHtml(event.meetLink)}</a></p>`
          : ""
      }
      <p><strong>Notas:</strong></p>
      <p>${escapeHtml(booking.notes || "Sin notas").replace(/\n/g, "<br />")}</p>
    </div>
  `;
}

function buildBookingConfirmationPlainTextEmail(
  booking: BookingRequestData,
  event: CalendarEventSummary,
  appointmentTime: string,
): string {
  return [
    `Hola ${booking.name},`,
    "",
    "Tu cita quedo confirmada con Sireon Systems.",
    "",
    `Fecha y hora: ${appointmentTime}`,
    event.meetLink ? `Google Meet: ${event.meetLink}` : "",
    event.htmlLink ? `Evento de calendario: ${event.htmlLink}` : "",
    "",
    "Adjuntamos un archivo .ics para que puedas agregar la cita a tu calendario si lo necesitas.",
    "",
    "Saludos,",
    "Equipo de Sireon Systems",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function buildBookingConfirmationHtmlEmail(
  booking: BookingRequestData,
  event: CalendarEventSummary,
  appointmentTime: string,
): string {
  return `
    <div style="font-family: Arial, sans-serif; color: #0B1F3A; line-height: 1.6;">
      <h1 style="font-size: 22px;">Tu cita qued&oacute; confirmada</h1>
      <p>Hola ${escapeHtml(booking.name)},</p>
      <p>Gracias por agendar un diagn&oacute;stico con <strong>Sireon Systems</strong>. Estos son los datos de la cita:</p>
      <div style="margin: 20px 0; padding: 16px; border: 1px solid #D8E3F0; border-radius: 8px; background: #F7FAFC;">
        <p style="margin: 0;"><strong>Fecha y hora:</strong> ${escapeHtml(appointmentTime)}</p>
        ${
          event.meetLink
            ? `<p style="margin: 8px 0 0;"><strong>Google Meet:</strong> <a href="${escapeHtml(event.meetLink)}">${escapeHtml(event.meetLink)}</a></p>`
            : ""
        }
        ${
          event.htmlLink
            ? `<p style="margin: 8px 0 0;"><strong>Evento:</strong> <a href="${escapeHtml(event.htmlLink)}">Abrir evento</a></p>`
            : ""
        }
      </div>
      <p><strong>Agregar a tu calendario:</strong> tambi&eacute;n adjuntamos un archivo .ics compatible con Google Calendar, Outlook y Apple Calendar.</p>
      <p>Saludos,<br />Equipo de Sireon Systems</p>
    </div>
  `;
}

function buildCalendarInvite(
  booking: BookingRequestData,
  event: CalendarEventSummary,
): string {
  const start = DateTime.fromISO(event.start ?? booking.start, {
    setZone: true,
  }).toUTC();
  const end = DateTime.fromISO(event.end ?? booking.start, {
    setZone: true,
  }).toUTC();
  const description = [
    "Diagnostico Sireon Systems",
    event.meetLink ? `Google Meet: ${event.meetLink}` : "",
    booking.notes ? `Notas: ${booking.notes}` : "",
  ]
    .filter(Boolean)
    .join("\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sireon Systems//Appointments//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${event.id || booking.email}-${start.toMillis()}@sireonsystems.com`,
    `DTSTAMP:${formatIcsDate(DateTime.utc())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    "SUMMARY:Diagnostico Sireon Systems",
    `DESCRIPTION:${escapeIcs(description)}`,
    event.meetLink ? `LOCATION:${escapeIcs(event.meetLink)}` : "",
    `ATTENDEE;CN=${escapeIcs(booking.name)};ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${booking.email}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter((line) => line !== "")
    .join("\r\n");
}

function formatAppointmentTime(value: string): string {
  const parsed = DateTime.fromISO(value, { setZone: true }).setZone(
    "America/Mexico_City",
  );

  if (!parsed.isValid) {
    return value;
  }

  return parsed.setLocale("es-MX").toFormat("d LLL yyyy, HH:mm");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeIcs(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function formatIcsDate(value: DateTime): string {
  return value.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
}

function toBase64(value: string): string {
  return Buffer.from(value, "utf8").toString("base64");
}
