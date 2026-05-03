import { NextResponse } from "next/server";

import {
  sendContactAutoReplyEmail,
  sendContactEmail,
} from "@/lib/contact/resend";
import { contactFormSchema } from "@/lib/contact/schema";
import {
  createContactOpportunity,
  recordEmailEvent,
} from "@/lib/crm/repository";
import { MissingEnvError } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Revisa los datos del formulario.",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const opportunity = await createContactOpportunity(parsed.data);
    const emailResults = await Promise.allSettled([
      sendContactEmail(parsed.data),
      sendContactAutoReplyEmail(parsed.data),
    ]);

    await Promise.allSettled([
      recordEmailEvent({
        opportunityId: opportunity.id,
        recipient: process.env.CONTACT_TO_EMAIL ?? "",
        subject: `Nueva oportunidad Sireon Systems: ${parsed.data.serviceInterest}`,
        template: "contact_internal",
        status: emailResults[0].status === "fulfilled" ? "sent" : "failed",
        providerMessageId:
          emailResults[0].status === "fulfilled" ? emailResults[0].value.id : "",
        errorMessage:
          emailResults[0].status === "rejected"
            ? String(emailResults[0].reason)
            : "",
      }),
      recordEmailEvent({
        opportunityId: opportunity.id,
        recipient: parsed.data.email,
        subject: "Recibimos tu solicitud - Sireon Systems",
        template: "contact_auto_reply",
        status: emailResults[1].status === "fulfilled" ? "sent" : "failed",
        providerMessageId:
          emailResults[1].status === "fulfilled" ? emailResults[1].value.id : "",
        errorMessage:
          emailResults[1].status === "rejected"
            ? String(emailResults[1].reason)
            : "",
      }),
    ]);

    return NextResponse.json({
      message: "Gracias. Recibimos tu mensaje y te responderemos pronto.",
    });
  } catch (error) {
    if (error instanceof MissingEnvError) {
      return NextResponse.json(
        {
          message:
            "El formulario aun no esta configurado. Revisa las variables de Resend.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        message:
          "No pudimos enviar tu mensaje en este momento. Inténtalo más tarde.",
      },
      { status: 500 },
    );
  }
}
