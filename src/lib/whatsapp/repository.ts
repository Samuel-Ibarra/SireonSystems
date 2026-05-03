import "server-only";

import type { ConversationState, WhatsappInboundMessage } from "./chatbot";
import { getSupabaseServerClient } from "@/lib/crm/supabase";

type ConversationRow = {
  id: string;
  state: string;
  status: string;
  collected_data: Record<string, unknown> | null;
};

export async function loadOrCreateWhatsappConversation(
  input: WhatsappInboundMessage,
) {
  const supabase = getSupabaseServerClient();
  const existing = await supabase
    .from("whatsapp_conversations")
    .select("id,state,status,collected_data")
    .eq("whatsapp_user_id", input.from)
    .maybeSingle<ConversationRow>();

  if (existing.error) {
    throw new Error(existing.error.message);
  }

  if (existing.data) {
    return {
      id: existing.data.id,
      state: toConversationState(existing.data.state),
      collectedData: existing.data.collected_data ?? {},
    };
  }

  const created = await supabase
    .from("whatsapp_conversations")
    .insert({
      whatsapp_user_id: input.from,
      phone: input.from,
      profile_name: input.profileName || null,
      state: "new",
      status: "open",
      collected_data: {},
    })
    .select("id,state,collected_data")
    .single<ConversationRow>();

  if (created.error) {
    throw new Error(created.error.message);
  }

  return {
    id: created.data.id,
    state: "new" as const,
    collectedData: {},
  };
}

function toConversationState(value: string): ConversationState {
  const states = new Set<ConversationState>([
    "new",
    "menu",
    "quote_name",
    "quote_company",
    "quote_service",
    "quote_need",
    "quote_email",
    "quote_phone",
    "schedule_name",
    "schedule_company",
    "schedule_email",
    "schedule_notes",
    "schedule_slot",
    "handoff",
  ]);

  return states.has(value as ConversationState)
    ? (value as ConversationState)
    : "menu";
}

export async function saveWhatsappConversation(
  conversationId: string,
  updates: {
    state?: string;
    status?: string;
    collectedData?: Record<string, unknown>;
  },
) {
  const supabase = getSupabaseServerClient();
  const result = await supabase
    .from("whatsapp_conversations")
    .update({
      state: updates.state,
      status: updates.status,
      collected_data: updates.collectedData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId);

  if (result.error) {
    throw new Error(result.error.message);
  }
}

export async function saveInboundWhatsappMessage(
  input: WhatsappInboundMessage,
  conversationId: string,
) {
  const supabase = getSupabaseServerClient();
  const result = await supabase
    .from("whatsapp_messages")
    .insert({
      conversation_id: conversationId,
      provider_message_id: input.messageId,
      direction: "inbound",
      from_phone: input.from,
      body: input.text,
      payload: input,
    })
    .select("id")
    .single();

  if (result.error) {
    if (result.error.message.includes("duplicate")) {
      return { duplicated: true };
    }

    throw new Error(result.error.message);
  }

  return { duplicated: false };
}

export async function saveOutboundWhatsappMessage(input: {
  conversationId: string;
  to: string;
  body: string;
  providerMessageId?: string;
}) {
  const supabase = getSupabaseServerClient();
  const result = await supabase
    .from("whatsapp_messages")
    .insert({
      conversation_id: input.conversationId,
      provider_message_id: input.providerMessageId ?? null,
      direction: "outbound",
      to_phone: input.to,
      body: input.body,
      payload: {},
    });

  if (result.error) {
    throw new Error(result.error.message);
  }
}
