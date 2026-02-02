"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    console.log("🔄 AuthProvider: Memulai pengecekan sesi...");

    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error("❌ AuthProvider Error:", error);
            return;
        }

        if (session?.user) {
          console.log("✅ Sesi Ditemukan:", session.user.email);
          
          // Mapping data dengan aman
          const userData = {
              id: session.user.id,
              email: session.user.email || "", // Fallback string kosong
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "User",
              avatar: session.user.user_metadata?.avatar_url || "",
              plan: 'Free' as 'Free' | 'Pro'
          };

          // Update Store
          setAuth(userData, session.access_token);
        } else {
          console.log("⚠️ Tidak ada sesi aktif (User belum login)");
          // Jangan panggil logout() di sini dulu agar tidak flashing saat reload
        }
      } catch (err) {
        console.error("Auth Check Failed:", err);
      }
    };

    checkUser();

    // Listener Realtime
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔔 Auth Event:", event);
      
      if (event === 'SIGNED_IN' && session?.user) {
         const userData = {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.full_name || "User",
            avatar: session.user.user_metadata?.avatar_url || "",
            plan: 'Free' as 'Free' | 'Pro'
        };
        setAuth(userData, session.access_token);
      } 
      else if (event === 'SIGNED_OUT') {
        logout();
        router.refresh();
        router.replace('/login'); // Ganti redirect ke halaman login yang benar
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuth, logout, router]);

  return <>{children}</>;
}