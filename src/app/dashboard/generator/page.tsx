"use client";

import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Settings2, 
  ChevronDown, 
  RefreshCw,
  BookOpen,
  HelpCircle, // Import icon baru untuk tab panduan
  Lightbulb
} from 'lucide-react';

// --- Tipe Data (TypeScript Interfaces) ---
interface SettingsState {
  model: string;
  tone: number;
  length: number;
  language: 'id' | 'en';
}

interface GenerateResponse {
  success: boolean;
  result?: string;
  error?: string;
}

export default function GeneratorPage() {
  // State Utama
  const [prompt, setPrompt] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  
  // State untuk Tab Sidebar (NEW)
  const [activeTab, setActiveTab] = useState<'config' | 'guide'>('config');

  // Default Settings
  const [settings, setSettings] = useState<SettingsState>({
    model: 'bab1',
    tone: 70,
    length: 50,
    language: 'id'
  });

  // Handler: Call API
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResult(''); 

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, settings }),
      });

      const data: GenerateResponse = await response.json();
      
      if (response.ok && data.result) {
        setResult(data.result);
      } else {
        alert(data.error || "Terjadi kesalahan.");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  // Handler: Copy to Clipboard
  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#f3f4f6] overflow-hidden font-sans">
      
      {/* --- AREA UTAMA (KIRI - SCROLLABLE) --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-8 max-w-4xl mx-auto w-full space-y-6">
          
          {/* BAGIAN 1: INPUT PROMPT */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
               <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                 <BookOpen size={16} className="text-blue-600"/> Input Prompt
               </h2>
               <span className="text-xs text-gray-400">{prompt.length}/2000 chars</span>
            </div>
            
            <div className="p-5">
              <textarea
                className="w-full min-h-[120px] resize-y outline-none text-base text-gray-800 placeholder-gray-400 font-sans leading-relaxed"
                placeholder="Tuliskan judul skripsi Anda di sini...&#10;Contoh: Sistem Absensi Berbasis Face Recognition Menggunakan Metode CNN."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Tombol Generate */}
            <div className="px-5 py-3 border-t border-gray-100 flex justify-end bg-white">
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm shadow-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Sedang Menulis...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Generate Thesis
                  </>
                )}
              </button>
            </div>
          </section>

          {/* BAGIAN 2: HASIL OUTPUT */}
          {(result || loading) && (
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 mb-10">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                   <Sparkles size={16} className="text-purple-600"/> Hasil Generator
                </h2>
                
                {!loading && result && (
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-black transition-colors"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Tersalin' : 'Salin Teks'}
                  </button>
                )}
              </div>

              <div className="p-6 min-h-[200px] bg-white">
                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap leading-7">
                    {result}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* --- SIDEBAR KANAN: SETTINGS (Fixed) --- */}
      <aside className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden z-10">
        
        {/* TAB HEADER (NEW) */}
        <div className="flex border-b border-gray-200 bg-gray-50/50">
            <button
                onClick={() => setActiveTab('config')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all border-b-2 ${
                    activeTab === 'config' 
                    ? 'border-black text-black bg-white' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
            >
                <Settings2 size={16} /> Konfigurasi
            </button>
            <button
                onClick={() => setActiveTab('guide')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all border-b-2 ${
                    activeTab === 'guide' 
                    ? 'border-black text-black bg-white' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
            >
                <HelpCircle size={16} /> Panduan
            </button>
        </div>

        {/* TAB CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
            
            {/* CONTENT 1: KONFIGURASI */}
            {activeTab === 'config' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                     {/* 1. Model Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Target Bab</label>
                        <div className="relative">
                            <select 
                                className="w-full appearance-none bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-1 focus:ring-black focus:border-black block p-3 pr-8 shadow-sm transition-all"
                                value={settings.model}
                                onChange={(e) => setSettings({...settings, model: e.target.value})}
                            >
                                <option value="bab1">Bab I - Pendahuluan</option>
                                <option value="bab2">Bab II - Tinjauan Pustaka</option>
                                <option value="bab3">Bab III - Metodologi</option>
                                <option value="bab4">Bab IV - Hasil & Pembahasan</option>
                                <option value="bab5">Bab V - Kesimpulan</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* 2. Academic Tone Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gaya Bahasa</label>
                            <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                {settings.tone > 70 ? 'Akademik Kaku' : settings.tone < 30 ? 'Santai' : 'Standar'}
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min="0" max="100" 
                            value={settings.tone}
                            onChange={(e) => setSettings({...settings, tone: parseInt(e.target.value)})}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                        />
                    </div>

                    {/* 3. Output Length Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Panjang Output</label>
                            <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                {settings.length > 70 ? 'Mendetail' : 'Poin-poin'}
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min="0" max="100" 
                            value={settings.length}
                            onChange={(e) => setSettings({...settings, length: parseInt(e.target.value)})}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                        />
                    </div>

                    {/* 4. Language Selector */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bahasa</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                onClick={() => setSettings({...settings, language: 'id'})}
                                className={`text-sm border rounded-lg py-2 px-3 transition-all ${settings.language === 'id' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                            >
                                Indonesia
                            </button>
                            <button 
                                onClick={() => setSettings({...settings, language: 'en'})}
                                className={`text-sm border rounded-lg py-2 px-3 transition-all ${settings.language === 'en' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                            >
                                English
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CONTENT 2: PANDUAN (NEW) */}
            {activeTab === 'guide' && (
                <div className="space-y-6 animate-in fade-in duration-300 text-sm text-gray-600 leading-relaxed">
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-semibold text-blue-900 flex items-center gap-2 mb-2">
                            <Lightbulb size={16} /> Tips Efektif
                        </h4>
                        <p className="text-xs text-blue-800">
                            Semakin spesifik prompt yang Anda berikan, semakin akurat hasil yang digenerate oleh AI.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-bold text-gray-800">Cara Menulis Prompt:</h4>
                        <ul className="list-disc pl-4 space-y-1 text-xs">
                            <li>Sebutkan <strong>Judul Skripsi</strong> Anda.</li>
                            <li>Tentukan <strong>Metode</strong> yang dipakai.</li>
                            <li>Jelaskan <strong>Objek Penelitian</strong>.</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-bold text-gray-800">Contoh Prompt Bab 1:</h4>
                        <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-700">
                            "Saya membuat aplikasi e-commerce. Tolong buatkan Latar Belakang Masalah yang fokus pada penurunan penjualan di toko fisik pasca pandemi."
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-bold text-gray-800">Contoh Prompt Bab 3:</h4>
                        <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-700">
                            "Buatkan alur metodologi penelitian menggunakan model Waterfall untuk pengembangan sistem informasi sekolah."
                        </div>
                    </div>

                </div>
            )}

        </div>
      </aside>

    </div>
  );
}