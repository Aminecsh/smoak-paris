import { createClient } from "@supabase/supabase-js";

// Client serveur uniquement — utilise la clé service_role qui bypass la RLS.
// Ne jamais importer ce fichier depuis un composant "use client".
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants dans .env.local",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
