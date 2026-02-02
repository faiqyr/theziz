"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore"; // Gunakan Store
import { supabase } from "@/lib/supabase"; 
import { Bell, LogOut, User as UserIcon, HelpCircle, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  
  // 1. Ambil data User dari Store (Langsung, tanpa loading)
  const { user, logout } = useAuthStore();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 2. Logika Judul Halaman Otomatis (Breadcrumb)
  const pageTitles: { [key: string]: string } = {
    "/dashboard": "Overview",
    "/dashboard/generator": "Thesis Generator",
    "/dashboard/literature": "Literature Review",
    "/dashboard/data": "Data Visualization",
    "/dashboard/agent": "AI Agents",
    "/dashboard/citation": "Citation Manager",
    "/dashboard/settings": "Settings",
  };
  
  const currentTitle = pageTitles[pathname] || "Project Workspace";

  // 3. Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.refresh();
    router.replace("/auth/login"); 
  };

  // Helper Initials
  const getInitials = () => {
    if (!user) return "U";
    if (user.name) return user.name[0].toUpperCase();
    return user.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <header className="h-16 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 md:px-8">
      
      {/* KIRI: Breadcrumb Dinamis (TEMA GELAP) */}
      <div className="flex items-center text-sm text-gray-400">
        <span className="hover:text-white transition-colors cursor-pointer">Theziz</span>
        <span className="mx-2 text-gray-600">/</span>
        <span className="font-semibold text-white transition-all animate-in fade-in slide-in-from-left-2">
          {currentTitle}
        </span>
      </div>

      {/* KANAN: Menu & Profil */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Menu Text */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm text-gray-400 hover:text-white transition-colors">
            Feedback
          </button>
          <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
             <HelpCircle size={14}/> Help
          </button>
        </div>

        {/* Separator */}
        <div className="h-4 w-[1px] bg-white/10 hidden md:block"></div>

        {/* Notifikasi */}
        <button className="text-gray-400 hover:text-white transition-colors relative p-1">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-black"></span>
        </button>

        {/* USER PROFILE DROPDOWN */}
        <div className="relative">
          
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 focus:outline-none group"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center text-xs font-bold border border-white/10 shadow-lg shadow-purple-900/20 group-hover:opacity-90 transition-all">
                {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                    getInitials()
                )}
            </div>
            {/* Chevron */}
            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* ISI DROPDOWN (TEMA GELAP) */}
          {isDropdownOpen && (
            <>
              {/* Overlay */}
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setIsDropdownOpen(false)} 
              />
              
              <div className="absolute right-0 top-full mt-2 w-56 bg-[#111] border border-white/10 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 z-40">
                
                {/* Info User */}
                <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name || "Researcher"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <Link 
                    href="/dashboard/profile" 
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <UserIcon size={16} /> Profile Settings
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
            </>
          )}
        </div>

      </div>
    </header>
  );
}