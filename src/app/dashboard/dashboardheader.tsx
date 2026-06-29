"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";
import { LogOut, Zap, ChevronDown } from "lucide-react";
import Link from "next/link";

// --- DATA STRUKTUR MENU THEZIZ ---
const navItems = [
  {
    name: "Generators",
    href: "/dashboard/generator",
    subGroups: [
      {
        title: "Thesis Chapters",
        items: [
          {
            label: "Thesis Prompt Generator",
            href: "/dashboard/thesisPrompt",
          },
          {
            label: "Research Field Prompt Generator",
            href: "/dashboard/researchField",
          },
          {
            label: "Research Topic Prompt Generator",
            href: "/dashboard/researchTopic",
          },
          { label: "SOTA Prompt Generator", href: "/dashboard/generator/sota" },
          {
            label: "Proposed Method Prompt Generator",
            href: "/dashboard/rp",
          },
        ],
      },
      {
        title: "Prompt Formats",
        items: [
          {
            label: "JSON-Structured Prompting",
            href: "/dashboard/generator/prompt-json",
          },
          {
            label: "Unstructured / Narrative Prompt",
            href: "/dashboard/generator/prompt-narrative",
          },
          {
            label: "Google Veo 3 Optimizer",
            href: "/dashboard/generator/veo3",
          },
        ],
      },
    ],
  },
  {
    name: "Literature",
    href: "/dashboard/literature",
    subGroups: [
      {
        title: "Review & Synthesis",
        items: [
          {
            label: "Auto-Literature Review",
            href: "/dashboard/literature/auto-review",
          },
          {
            label: "Journal Summarizer",
            href: "/dashboard/literature/summarizer",
          },
          {
            label: "State of the Art (SOTA) Finder",
            href: "/dashboard/literature/sota",
          },
        ],
      },
    ],
  },
  {
    name: "Data & Evaluation",
    href: "/dashboard/evaluation",
    subGroups: [
      {
        title: "Visual Metrics",
        items: [
          {
            label: "LPIPS Perceptual Analyzer",
            href: "/dashboard/evaluation/lpips",
          },
          {
            label: "Flickering & Morphing Detector",
            href: "/dashboard/evaluation/consistency",
          },
          {
            label: "Temporal Stability Checker",
            href: "/dashboard/evaluation/temporal",
          },
        ],
      },
    ],
  },
  {
    name: "Agents",
    href: "/dashboard/agent",
    subGroups: [
      {
        title: "AI Assistants",
        items: [
          {
            label: "Auto-Researcher Agent",
            href: "/dashboard/agent/researcher",
          },
          {
            label: "Academic Writing Checker",
            href: "/dashboard/agent/writer",
          },
        ],
      },
    ],
  },
];

export default function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.refresh();
    router.replace("/auth/login");
  };

  const getInitials = () => {
    if (!user) return "U";
    if (user.name) return user.name[0].toUpperCase();
    return user.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <header className="h-[60px] bg-[#11131a] border-b border-[#2a2d3e] flex items-center justify-between px-4 sticky top-0 z-30">
      {/* TENGAH: Menu Navigasi dengan Dropdown Mega Menu */}
      <nav className="hidden lg:flex items-center gap-2 h-full">
        {navItems.map((item) => (
          <div
            key={item.name}
            className="relative group h-full flex items-center"
          >
            <Link
              href={item.href}
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-[14px] font-medium transition-colors hover:text-white ${
                pathname.includes(item.href) ? "text-white" : "text-gray-400"
              }`}
            >
              {item.name}
              {item.subGroups && (
                <ChevronDown
                  size={14}
                  className="group-hover:rotate-180 transition-transform duration-200"
                />
              )}
            </Link>

            {/* DROPDOWN SUB-MENU */}
            {item.subGroups && (
              <div className="absolute top-[60px] left-0 hidden group-hover:block w-max min-w-[240px] pt-2">
                <div className="bg-[#1a1d27] border border-[#2a2d3e] rounded-lg shadow-2xl p-4 flex gap-8 relative z-50 animate-in fade-in slide-in-from-top-2">
                  {item.subGroups.map((group, idx) => (
                    <div key={idx} className="flex flex-col">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        {group.title}
                      </h4>
                      <ul className="flex flex-col gap-1">
                        {group.items.map((subItem, subIdx) => (
                          <li key={subIdx}>
                            <Link
                              href={subItem.href}
                              className="text-sm text-gray-300 hover:text-white hover:bg-white/5 block px-2 py-1.5 rounded-md transition-colors"
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* KANAN: Tombol Account */}
      <div className="flex items-center">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-transparent hover:bg-white/5 border border-white/10 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none"
          >
            {/* Profil Avatar / Inisial */}
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-[10px] font-bold overflow-hidden border border-white/20">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials()
              )}
            </div>
            Account
          </button>

          {/* ISI DROPDOWN ACCOUNT */}
          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1d27] border border-[#2a2d3e] rounded-md shadow-2xl py-1 animate-in fade-in slide-in-from-top-2 z-40">
                <div className="px-4 py-2 border-b border-[#2a2d3e]">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name || "Researcher"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
                <div className="py-1">
                  <Link
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2d3e] hover:text-white transition"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile Settings
                  </Link>
                </div>
                <div className="border-t border-[#2a2d3e] my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-[#2a2d3e] transition text-left"
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
