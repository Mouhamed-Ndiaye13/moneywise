import { createClient } from "@supabase/supabase-js";

// ⚠️ Remplace par tes vraies clés Supabase
const supabaseUrl = "https://vxzofyravupigosisrlg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4em9meXJhdnVwaWdvc2lzcmxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNDgxMTYsImV4cCI6MjA3NjYyNDExNn0.EPRWcxtkKEXr_z0od9HG-OyBuAh7TVmMgHh6fovqOv4";

// Crée le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
