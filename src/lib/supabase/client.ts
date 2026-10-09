import { createBrowserClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseEnv } from "./config";

let browserClient: SupabaseClient | undefined;
let publicClient: SupabaseClient | undefined;

export function getBrowserClient(): SupabaseClient {
  if (!browserClient) {
    const { url, key } = requireSupabaseEnv();
    browserClient = createBrowserClient(url, key);
  }
  return browserClient;
}

export function getPublicClient(): SupabaseClient {
  if (!publicClient) {
    const { url, key } = requireSupabaseEnv();
    publicClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return publicClient;
}
