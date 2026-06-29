// GANTI library import-nya dari 'supabase-js' menjadi 'ssr'
import { createBrowserClient } from '@supabase/ssr';

// Hardcode URL & Key kamu (sesuai setup saat ini)
const supabaseUrl = "https://jyzvurrhpxtlegsvuabf.supabase.co";
const supabaseAnonKey = "sb_publishable_XU_67a7VLmiAdZi5yEcyQg_T2bAejpk";

// Gunakan createBrowserClient agar data auth tersimpan di Cookies
export const supabase = createBrowserClient(
  supabaseUrl, 
  supabaseAnonKey
);