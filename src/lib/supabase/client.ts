import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a dummy client or handle the missing config gracefully in components.
    // createBrowserClient still needs strings to initialize without throwing during build.
    return createBrowserClient(
      supabaseUrl || "https://placeholder.supabase.co",
      supabaseAnonKey || "placeholder"
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
