"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

// 1. Membuat "Wadah" (Context) untuk menyimpan data user
const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
}>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // A. Fungsi untuk mengecek sesi saat aplikasi pertama kali dimuat
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // B. "Sensor" Real-time yang mendeteksi perubahan status (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Jika user logout, paksa refresh agar data bersih dan pindah ke login
      if (_event === "SIGNED_OUT") {
        router.push("/auth/login");
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    // 2. Membagikan data user dan status loading ke seluruh aplikasi
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Hook khusus agar kita bisa panggil 'useAuth()' di file lain dengan mudah
export const useAuth = () => useContext(AuthContext);