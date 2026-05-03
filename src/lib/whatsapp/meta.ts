import "server-only";

import { requiredEnv } from "@/lib/env";

type MetaSendResponse = {
  messages?: Array<{ id?: string }>;
  error?: { message?: string };
};

export async function sendWhatsappTextMessage(to: string, text: string) {
  const response = await fetch(
    `https://graph.facebook.com/v20.0/${requiredEnv("WHATSAPP_PHONE_NUMBER_ID")}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${requiredEnv("WHATSAPP_ACCESS_TOKEN")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: {
          preview_url: false,
          body: text,
        },
      }),
    },
  );
  const payload = (await response.json().catch(() => ({}))) as MetaSendResponse;

  if (!response.ok) {
    throw new Error(payload.error?.message ?? "No fue posible enviar WhatsApp.");
  }

  return {
    id: payload.messages?.[0]?.id ?? "",
  };
}
