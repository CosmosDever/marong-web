import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lwqyvoxcjkrkrgaxdxso.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3cXl2b3hjamtya3JnYXhkeHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyOTY2MzMsImV4cCI6MjA1Mjg3MjYzM30.oOc-k3IPLinVi_dEklPxIK5zSY4T2NmHFdeEpQ9aLPY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
