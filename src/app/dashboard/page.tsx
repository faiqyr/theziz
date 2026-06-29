"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore"; // 1. Import Store
import { 
  Sparkles, 
  BookOpen, 
  FileText, 
  PenTool, 
  Search, 
  MessageSquare, 
  ArrowRight,
  Plus
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // 2. Ambil data user dari Store
  const { user } = useAuthStore();
  
  // State lokal untuk nama tampilan (default "Researcher" agar tidak error saat loading)
  const [displayName, setDisplayName] = useState("Researcher");

  // 3. Update nama saat data user dari store tersedia
  useEffect(() => {
    if (user && user.name) {
      // Ambil nama depan saja
      setDisplayName(user.name.split(" ")[0]);
    }
  }, [user]);

  const features = [
    {
      title: "Theziz AI",
      desc: "Generate outline & chapter drafts instantly.",
      icon: Sparkles,
      color: "text-yellow-400",
      bg: "group-hover:bg-yellow-400/10",
      href: "/dashboard/thezizAI"
    },
    {
      title: "Thesis Prompt Generator",
      desc: "Generate Prompt with Thesis Blueprint",
      icon: BookOpen,
      color: "text-red-400",
      bg: "group-hover:bg-red-400/10",
      href: "/dashboard/thesisPrompt"
    },
    {
      title: "Template Generator",
      desc: "Download Thesis Template with AI.",
      icon: FileText,
      color: "text-green-400",
      bg: "group-hover:bg-green-400/10",
      href: "/dashboard/templateGenerator"
    },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      
      {/* Welcome Section */}
      <div className="mb-10 mt-4">
        
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Good morning, {displayName}
        </h1>
        <p className="text-gray-400 mt-2">Ready to make progress on your research today?</p>
      </div>

      {/* Main Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((item, idx) => (
          <Link 
            href={item.href} 
            key={idx}
            className="group relative bg-[#111] hover:bg-[#161616] border border-white/5 hover:border-white/20 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"
          >
            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 transition-colors ${item.bg}`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {item.desc}
            </p>

            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
              <ArrowRight className="text-white/20" size={20} />
            </div>
          </Link>
        ))}
      </div>

      {/* Secondary Section (Latest Projects) */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-xl font-bold text-white">Latest from your library</h2>
           <Link href="/dashboard/projects" className="text-sm text-purple-400 hover:text-purple-300">View all</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Card 1 */}
           <div className="flex items-center gap-4 bg-[#111] p-4 rounded-2xl border border-white/5 hover:border-white/10 transition cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
                 <FileText className="text-green-400" size={20} />
              </div>
              <div>
                 <h4 className="font-medium text-white">Bab 1 - Pendahuluan.docx</h4>
                 <p className="text-xs text-gray-500">Edited 2 hours ago</p>
              </div>
           </div>

           {/* Card 2 (Create New) */}
           <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition cursor-pointer border-dashed">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                 <Plus className="text-white" size={20} />
              </div>
              <div>
                 <h4 className="font-medium text-white">Create New Project</h4>
                 <p className="text-xs text-gray-500">Start from scratch or upload</p>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
}