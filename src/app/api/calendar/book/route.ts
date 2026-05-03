import { NextResponse } from "next/server";

import {
  createBookingRules,
  isSlotAvailable,
} from "@/lib/calendar/availability";
import { bookingRequestSchema } from "@/lib/calendar/booking";
import {
  createDiagnosticEvent,
  getCalendarBusyBlocks,
} from "@/lib/calendar/google";
import {
  sendBookingConfirmationEmail,
  sendBookingNotificationEmail,
} from "@/lib/contact/resend";
import {
  createAppointmentRequest,
  recordEmailEvent,
  updateAppointmentConfirmation,
} from "@/lib/crm/repository";
import { MissingEnvError } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bookingRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Revisa los datos de la reserva.",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const rules = createBookingRules();
    const busy = await getCalendarBusyBlocks({
      nowIso: parsed.data.start,
      rules,
    });
    const available = isSlotAvailable({
      startIso: parsed.data.start,
      busy,
      rules,
    });

    if (!available) {
      return NextResponse.json(
        {
          message:
            "Ese horario ya no esta disponible. Elige otro horario de la lista.",
        },
        { status: 409 },
      );
    }

    const record = await createAppointmentRequest(parsed.data);
    const event = await createDiagnosticEvent(parsed.data, rules);
    await updateAppointmentConfirmation(record.appointmentId, event);
    const emailResults = await Promise.allSettled([
      sendBookingNotificationEmail(parsed.data, event),
      sendBookingConfirmationEmail(parsed.data, event),
    ]);
    const notificationSent = emailResults[0].status === "fulfilled";
    const confirmationSent = emailResults[1].status === "fulfilled";

    await Promise.allSettled([
      recordEmailEvent({
        opportunityId: record.opportunityId,
        appointmentId: record.appointmentId,
        recipient: process.env.CONTACT_TO_EMAIL ?? "",
        subject: `Nueva cita Sireon Systems: ${parsed.data.name}`,
        template: "booking_internal",
        status: notificationSent ? "sent" : "failed",
        providerMessageId:
          emailResults[0].status === "fulfilled" ? emailResults[0].value.id : "",
        errorMessage:
          emailResults[0].status === "rejected"
            ? String(emailResults[0].reason)
            : "",
      }),
      recordEmailEvent({
        opportunityId: record.opportunityId,
        appointmentId: record.appointmentId,
        recipient: parsed.data.email,
        subject: "Confirmacion de cita - Sireon Systems",
        template: "booking_confirmation",
        status: confirmationSent ? "sent" : "failed",
        providerMessageId:
          emailResults[1].status === "fulfilled" ? emailResults[1].value.id : "",
        errorMessage:
          emailResults[1].status === "rejected"
            ? String(emailResults[1].reason)
            : "",
      }),
    ]);

    return NextResponse.json({
      message:
        notificationSent && confirmationSent
          ? "Tu llamada quedó agendada. Te enviamos la confirmación por correo."
          : "Tu llamada quedó agendada, pero no pudimos enviar todos los correos de confirmación.",
      event,
      notificationSent,
      confirmationSent,
    });
  } catch (error) {
    if (error instanceof MissingEnvError) {
      return NextResponse.json(
        {
          message:
            "La agenda aun no esta configurada. Revisa las variables de Google Calendar.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        message:
          "No pudimos agendar la llamada en este momento. Inténtalo más tarde.",
      },
      { status: 500 },
    );
  }
}
