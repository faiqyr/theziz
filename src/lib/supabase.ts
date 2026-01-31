// GANTI library import-nya dari 'supabase-js' menjadi 'ssr'
import { createBrowserClient } from '@supabase/ssr';

// Hardcode URL & Key kamu (sesuai setup saat ini)
const supabaseUrl = "https://fvkfzdezhvrgipptlevo.supabase.co";
const supabaseAnonKey = "sb_publishable_-LIixhC11YXrU-KG3FR3_A_inkE1BsC";

// Gunakan createBrowserClient agar data auth tersimpan di Cookies
export const supabase = createBrowserClient(
  supabaseUrl, 
  supabaseAnonKey
);