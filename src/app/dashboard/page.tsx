"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
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
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Ambil nama depan saja
        const fullName = user.user_metadata?.full_name || "Researcher";
        setUserName(fullName.split(" ")[0]);
      }
    };
    getUser();
  }, []);

  const features = [
    {
      title: "Thesis Generator",
      desc: "Generate outline & chapter drafts instantly.",
      icon: Sparkles,
      color: "text-yellow-400",
      bg: "group-hover:bg-yellow-400/10",
      href: "/dashboard/generator"
    },
    {
      title: "Literature Review",
      desc: "Analyze 100+ papers in seconds.",
      icon: BookOpen,
      color: "text-red-400",
      bg: "group-hover:bg-red-400/10",
      href: "/dashboard/literature"
    },
    {
      title: "Data Visualization",
      desc: "Turn raw data into beautiful charts.",
      icon: FileText,
      color: "text-green-400",
      bg: "group-hover:bg-green-400/10",
      href: "/dashboard/data"
    },
    {
      title: "AI Agents",
      desc: "Deep research on specific topics.",
      icon: MessageSquare,
      color: "text-purple-400",
      bg: "group-hover:bg-purple-400/10",
      href: "/dashboard/agent"
    },
    {
      title: "Citation Manager",
      desc: "Auto-fix APA, MLA, IEEE styles.",
      icon: Search,
      color: "text-orange-400",
      bg: "group-hover:bg-orange-400/10",
      href: "/dashboard/citation"
    },
    {
      title: "Paraphraser",
      desc: "Rewrite text to avoid plagiarism.",
      icon: PenTool,
      color: "text-blue-400",
      bg: "group-hover:bg-blue-400/10",
      href: "/dashboard/paraphrase"
    },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      
      {/* Welcome Section */}
      <div className="mb-10 mt-4">
        <div className="flex items-center gap-2 mb-2">
           <span className="bg-white/10 text-white text-xs px-2 py-1 rounded-full border border-white/10">
             New Update
           </span>
           <span className="text-xs text-gray-400">Introducing Theziz 2.0 with Deep Reasoning &rarr;</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Good morning, {userName}
        </h1>
        <p className="text-gray-400 mt-2">Ready to make progress on your research today?</p>
      </div>

      {/* Main Grid Features (Mirip ElevenLabs) */}
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
           <h2 className="text-xl font-bold">Latest from your library</h2>
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