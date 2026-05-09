import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.");
}

export const supabase = createClient(supabaseUrl ?? "", supabaseKey ?? "");

export const getAppUrl = () => {
  const configuredUrl = import.meta.env.VITE_APP_URL;
  const currentOrigin = window.location.origin;

  if (!configuredUrl) return currentOrigin;

  const configuredHost = new URL(configuredUrl).hostname;
  const currentHost = window.location.hostname;
  const configuredIsLocal = ["localhost", "127.0.0.1"].includes(configuredHost);
  const currentIsLocal = ["localhost", "127.0.0.1"].includes(currentHost);

  return configuredIsLocal && !currentIsLocal ? currentOrigin : configuredUrl;
};
