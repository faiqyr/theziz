"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Settings2,
  ChevronDown,
  RefreshCw,
  Send,
  Trash2,
  User,
  HelpCircle,
  Lightbulb,
  Pencil,
  Zap,
} from "lucide-react";

import { useThesisStore } from "@/store/useThesisStore";

export default function GeneratorPage() {
  const {
    messages,
    addMessage,
    currentInput,
    setCurrentInput,
    isLoading,
    setLoading,
    settings,
    setSettings,
    clearHistory,
    editAndTruncate,
  } = useThesisStore();

  const [activeTab, setActiveTab] = useState<"config" | "guide">("config");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editingId) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, editingId]);

  const triggerAPI = async (promptText: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText, settings }),
      });
      const data = await response.json();
      if (response.ok && data.result) {
        addMessage("ai", data.result);
      } else {
        addMessage("ai", `Error: ${data.error || "Gagal memproses."}`);
      }
    } catch (error) {
      addMessage("ai", "Error koneksi server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const text = currentInput || "";
    if (!text.trim()) return;
    addMessage("user", text);
    setCurrentInput("");
    await triggerAPI(text);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editText.trim()) return;
    editAndTruncate(id, editText);
    setEditingId(null);
    setEditText("");
    await triggerAPI(editText);
  };

  const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    return (
      <button
        onClick={handleCopy}
        className="p-1.5 text-gray-400 hover:text-black transition-colors rounded"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    );
  };

  return (
    <div className="flex w-full h-[calc(100vh-4rem)] bg-[#f9fafb] overflow-hidden font-sans">
      {/* AREA CHAT (KIRI) */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
          {(!messages || messages.length === 0) && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 select-none pb-20">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-600">
                Mulai Riset Skripsi Anda
              </h3>
              <p className="text-sm text-gray-400 max-w-md mt-2">
                Tulis topik skripsi di bawah, pilih model AI di sebelah kanan.
              </p>
            </div>
          )}

          {messages &&
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"} w-full`}
              >
                {msg.role === "ai" && (
                  <div
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${settings.aiProvider === "groq" ? "bg-orange-600" : "bg-black"}`}
                  >
                    {settings.aiProvider === "groq" && msg.role === "ai" ? (
                      <Zap size={14} className="text-white" />
                    ) : (
                      <Sparkles size={14} className="text-purple-400" />
                    )}
                  </div>
                )}

                <div
                  className={`relative group max-w-[85%] min-w-0 ${editingId === msg.id ? "w-full max-w-[90%]" : ""}`}
                >
                  {editingId === msg.id ? (
                    <div className="bg-white border border-gray-300 rounded-xl p-3 shadow-md">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full min-h-[80px] p-2 text-sm text-gray-900 outline-none resize-none bg-gray-50 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black/10"
                      />
                      <div className="flex justify-end gap-2 mt-3">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(msg.id)}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-black hover:bg-gray-800 rounded-lg flex items-center gap-1"
                        >
                          <RefreshCw size={12} /> Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`rounded-2xl p-5 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm relative ${
                        msg.role === "user"
                          ? "bg-black text-white rounded-tr-none"
                          : "bg-white text-gray-900 border border-gray-200 rounded-tl-none"
                      }`}
                    >
                      {msg.content}
                      {msg.role === "ai" && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <CopyButton text={msg.content} />
                        </div>
                      )}
                      {msg.role === "user" && (
                        <div className="absolute top-2 left-[-40px] opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingId(msg.id);
                              setEditText(msg.content);
                            }}
                            className="p-2 text-gray-400 hover:text-black bg-white/50 hover:bg-white rounded-full shadow-sm border border-transparent hover:border-gray-200"
                          >
                            <Pencil size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center mt-1">
                    <User size={14} className="text-gray-500" />
                  </div>
                )}
              </div>
            ))}

          {isLoading && (
            <div className="flex gap-4 justify-start animate-pulse">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${settings.aiProvider === "groq" ? "bg-orange-600" : "bg-black"}`}
              >
                <RefreshCw size={14} className="text-white animate-spin" />
              </div>
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none text-sm text-gray-500">
                Sedang menulis ulang...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="p-4 md:p-6 bg-white border-t border-gray-200 z-20 flex-shrink-0">
          <div className="max-w-3xl mx-auto relative shadow-sm rounded-xl border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-black/5 focus-within:border-black transition-all">
            <textarea
              value={currentInput || ""}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Contoh: Buatkan Bab 1 tentang Dampak AI terhadap UMKM..."
              className="w-full max-h-40 min-h-[60px] p-4 pr-12 resize-none outline-none text-sm bg-transparent rounded-xl text-gray-900 placeholder:text-gray-400"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !(currentInput || "").trim()}
              className="absolute right-3 bottom-3 p-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
          <div className="flex justify-between items-center mt-2 px-1">
            <span className="text-[10px] text-gray-400">
              {(currentInput || "").length}/2000 chars
            </span>
            <button
              onClick={clearHistory}
              className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <Trash2 size={10} /> Hapus History
            </button>
          </div>
        </div>
      </div>

      {/* SIDEBAR KONFIGURASI (KANAN) */}
      <aside className="w-80 h-full bg-white border-l border-gray-200 flex flex-col overflow-hidden z-10 hidden lg:flex flex-shrink-0">
        <div className="flex border-b border-gray-200 bg-gray-50/50 flex-shrink-0">
          <button
            onClick={() => setActiveTab("config")}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 ${activeTab === "config" ? "border-black text-black bg-white" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
          >
            <Settings2 size={16} /> Konfigurasi
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`flex-1 py-3 text-sm cursor-pointer font-medium flex items-center justify-center gap-2 border-b-2 ${activeTab === "guide" ? "border-black text-black bg-white" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
          >
            <HelpCircle size={16} /> Panduan
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {activeTab === "config" && (
            <div className="space-y-8 animate-in fade-in duration-300 pb-10">
              {/* PILIH PROVIDER */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Model AI (Free)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSettings({ aiProvider: "gemini" })}
                    className={`flex items-center cursor-pointer justify-center gap-2 text-sm border rounded-lg py-2.5 px-3 transition-all duration-200 ${
                      settings.aiProvider === "gemini"
                        ? "bg-black text-white border-black shadow-md hover:bg-gray-800"
                        : "bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black hover:bg-gray-50"
                    }`}
                  >
                    <Sparkles
                      size={14}
                      className={
                        settings.aiProvider === "gemini"
                          ? "text-purple-400"
                          : "text-gray-400"
                      }
                    />
                    Gemini
                  </button>
                  <button
                    onClick={() => setSettings({ aiProvider: "groq" })}
                    className={`flex items-center cursor-pointer justify-center gap-2 text-sm border rounded-lg py-2.5 px-3 transition-all duration-200 ${
                      settings.aiProvider === "groq"
                        ? "bg-orange-600 text-white border-orange-600 shadow-md hover:bg-orange-700"
                        : "bg-white text-gray-600 border-gray-200 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                  >
                    <Zap
                      size={14}
                      className={
                        settings.aiProvider === "groq"
                          ? "fill-current"
                          : "text-orange-500"
                      }
                    />
                    Groq
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Target Bab
                </label>
                <div className="relative ">
                  <select
                    className="w-full appearance-none bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-1 focus:ring-black focus:border-black block p-3 pr-8 shadow-sm"
                    value={settings.model}
                    onChange={(e) => setSettings({ model: e.target.value })}
                  >
                    <option value="bab1">Bab I - Pendahuluan</option>
                    <option value="bab2">Bab II - Tinjauan Pustaka</option>
                    <option value="bab3">Bab III - Metodologi</option>
                    <option value="bab4">Bab IV - Hasil & Pembahasan</option>
                    <option value="bab5">Bab V - Kesimpulan</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-3.5 text-gray-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
              {/* Sisa setting (Tone, Length, Language) sama seperti sebelumnya */}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
