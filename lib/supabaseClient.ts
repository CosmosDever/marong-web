import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ehgrrrqbimqxntypkije.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoZ3JycnFiaW1xeG50eXBraWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxODYxMzIsImV4cCI6MjA1Mjc2MjEzMn0.dMFIcdvM42DlyjCcVOTORNJWZY-uwnf46rpBzhQ-5Vg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
