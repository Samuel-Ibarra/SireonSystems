import { createClient } from "@supabase/supabase-js";

import { requiredEnv } from "@/lib/env";

export function getSupabaseServerClient() {
  return createClient(requiredEnv("SUPABASE_URL"), requiredEnv("SUPABASE_SECRET_KEY"), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
