// src/utils/SupaClient.js
import { createClient } from "@supabase/supabase-js";

// Ganti dengan URL dan anon key kamu sendiri
const supabaseUrl = "https://slfytjpkrfvbyuhxnjrd.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZnl0anBrcmZ2Ynl1aHhuanJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMzEwNzIsImV4cCI6MjA2NzkwNzA3Mn0.py2FBGnDNn6cv9GF7t_kAI0YuVmgen7DLOjtURme8iI";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
