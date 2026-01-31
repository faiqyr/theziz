"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardHeader() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // State loading agar tidak "kedip"
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Gagal ambil user:", error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.replace("/auth/login"); // Paksa pindah ke login
  };

  // Ambil inisial nama (Misal: "Faiq" -> "F")
  const getInitials = () => {
    if (!user) return "U";
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name[0].toUpperCase();
    }
    return user.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <header className="h-16 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 md:px-8">
      
      {/* KIRI: Breadcrumb */}
      <div className="flex items-center text-sm text-gray-400">
        <span className="hover:text-white cursor-pointer transition-colors">Home</span>
      </div>

      {/* KANAN: Menu & Profil */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Menu Text (Feedback & Docs) */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm text-gray-400 hover:text-white transition-colors">
            Feedback
          </button>
          <button className="text-sm text-gray-400 hover:text-white transition-colors">
            Docs
          </button>
        </div>

        {/* Separator Tipis */}
        <div className="h-4 w-[1px] bg-white/10 hidden md:block"></div>

        {/* Ikon Notifikasi (Lonceng) */}
        <button className="text-gray-400 hover:text-white transition-colors relative">
          <Bell size={20} />
          {/* Titik Merah Notif */}
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-black"></span>
        </button>

        {/* USER PROFILE (Bagian yang tadi hilang) */}
        <div className="relative">
          
          {loading ? (
             // 1. TAMPILAN LOADING (Lingkaran Abu-abu)
             <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />
          ) : user ? (
             // 2. TAMPILAN SUDAH LOGIN (Avatar Warna-warni)
             <button 
               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
               className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-sm border border-white/10 hover:opacity-90 transition shadow-lg shadow-purple-900/20"
             >
               {getInitials()}
             </button>
          ) : (
             // 3. JIKA BELUM LOGIN (Fallback)
             <Link href="/auth/login" className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300">
               ?
             </Link>
          )}

          {/* DROPDOWN MENU (Saat Avatar Diklik) */}
          {isDropdownOpen && user && (
            <div className="absolute right-0 top-full mt-3 w-56 bg-[#111] border border-white/10 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 overflow-hidden z-50">
              
              {/* Info User */}
              <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                <p className="text-sm text-white font-medium truncate">
                  {user.user_metadata?.full_name || "Researcher"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <Link href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition">
                  <User size={16} /> Profile Settings
                </Link>
              </div>
              
              <div className="border-t border-white/5 my-1"></div>
              
              {/* Logout */}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition text-left"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}