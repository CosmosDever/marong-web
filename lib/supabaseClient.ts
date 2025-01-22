import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yoqhhfzgucuarcyskigr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvcWhoZnpndWN1YXJjeXNraWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyOTY2NzUsImV4cCI6MjA1Mjg3MjY3NX0.Y65OyBEGFTKiXoyjSpVNnBSucxcRH8cBat42a9CDQME";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
