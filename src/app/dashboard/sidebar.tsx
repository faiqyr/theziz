"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  PenTool,
  FileText,
  Search,
  MessageSquare,
  Settings,
  Video,
  Zap,
} from "lucide-react";

const menuItems = [
  { name: "Home", icon: LayoutDashboard, href: "/dashboard" },
  { name: "My Projects", icon: FileText, href: "/dashboard/projects" },
];

const toolItems = [
  {
    name: "Thesis Generator",
    icon: Zap,
    href: "/dashboard/generator",
    new: true,
  },
  { name: "Thesis Blueprint", icon: BookOpen, href: "/dashboard/blueprint" },
  { name: "Paraphraser", icon: PenTool, href: "/dashboard/paraphrase" },
  { name: "Citation Fixer", icon: Search, href: "/dashboard/citation" },
  { name: "AI Chat Assistant", icon: MessageSquare, href: "/dashboard/chat" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 fixed left-0 top-0 h-screen bg-black border-r border-white/10 flex flex-col z-40 hidden md:flex">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <Link
          href="/dashboard"
          className="flex items-center group cursor-pointer"
        >
          {/* Logo */}
          <img
            src="/logo.png"
            alt="Theziz Logo"
            className="w-10 h-10 object-contain mr-2 transition-transform group-hover:scale-105"
          />

          {/* Teks Brand */}
          <h1 className="text-xl font-bold transition-colors group-hover:text-white text-gray-200">
            Theziz
          </h1>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
        {/* Main Menu */}
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </div>

        {/* Tools Section */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Research Tools
          </h3>
          <div className="space-y-1">
            {toolItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  {item.name}
                </div>
                {item.new && (
                  <span className="text-[10px] bg-purple-600/20 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/20">
                    BETA
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* User / Settings Bottom */}
      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-400 hover:text-white transition">
          <Settings size={18} />
          Settings
        </button>
      </div>
    </aside>
  );
}
