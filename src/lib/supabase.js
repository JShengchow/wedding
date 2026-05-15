const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
);

let supabaseClient = null;

async function getSupabase() {
  if (!isSupabaseConfigured) {
    return null;
  }

  if (!supabaseClient) {
    const { createClient } = await import("@supabase/supabase-js");
    supabaseClient = createClient(supabaseUrl, supabasePublishableKey);
  }

  return supabaseClient;
}

export async function submitRsvp(form) {
  const supabase = await getSupabase();

  if (!supabase) {
    const list = JSON.parse(
      window.localStorage.getItem("wedding-rsvp") || "[]",
    );

    list.push({
      ...form,
      createdAt: new Date().toISOString(),
    });

    window.localStorage.setItem("wedding-rsvp", JSON.stringify(list));
    return;
  }

  const { error } = await supabase.from("wedding_rsvp").insert({
    name: form.name,
    phone: form.phone,
    attendance: form.attendance,
    guests: form.guests,
    message: form.message || null,
  });

  if (error) {
    throw error;
  }
}
