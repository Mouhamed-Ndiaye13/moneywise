import { supabase } from "../supabase";

export async function sendNotification(userId, message, type = "info") {
  if (!userId) return;

  const { error } = await supabase.from("notifications").insert([
    { user_id: userId, message, type }
  ]);

  if (error) console.error("Erreur lors de l'envoi de la notif:", error.message);
}
