// src/utils/notifications.js
import { supabase } from "../supabase";

export async function addNotification(user_id, message, type = "success") {
  if (!user_id || !message) return;
  const { data, error } = await supabase.from("notifications").insert([
    {
      user_id,
      message,
      type,
      read: false
    }
  ]);
  if (error) console.error("Erreur d'upload de notification :", error.message);
  return data;
}
