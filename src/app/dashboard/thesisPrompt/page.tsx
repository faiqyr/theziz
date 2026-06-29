"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useThesisStore } from "@/store/useThesisStore";
import { 
  BookOpen, Settings2, Wand2, FileText, ChevronDown, Sparkles, Database, AlertTriangle, ListChecks, Layers, GraduationCap, Link as LinkIcon, Lock, Crown, X, Copy, Check
} from "lucide-react";

export default function ThesisPromptGenerator() {
  const router = useRouter();
  
  const { theses, activeThesisId, setActiveThesis, generatorSettings, updateGeneratorSettings } = useThesisStore();
  const activeThesis = theses.find((t) => t.id === activeThesisId) || theses[0];
  const isContextEmpty = !activeThesis.title?.trim() || !activeThesis.mainProblem?.trim();

  const [activeChapter, setActiveChapter] = useState("bab1");

  // --- STATE UNTUK MODAL OUTPUT JSON ---
  const [showModal, setShowModal] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [displayedPrompt, setDisplayedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Helper functions
  const toggleLatarBelakang = (key: keyof typeof generatorSettings.latarBelakang) => {
    updateGeneratorSettings({
      latarBelakang: { ...generatorSettings.latarBelakang, [key]: !generatorSettings.latarBelakang[key] }
    });
  };

  const toggleSumberReferensi = (key: keyof typeof generatorSettings.sumberReferensi) => {
    updateGeneratorSettings({
      sumberReferensi: { ...generatorSettings.sumberReferensi, [key]: !generatorSettings.sumberReferensi[key] }
    });
  };

  const validRPs = activeThesis.rp?.filter(p => p.trim() !== "") || [];
  const validRQs = activeThesis.rq?.filter(q => q.trim() !== "") || [];
  const validROs = activeThesis.ro?.filter(o => o.trim() !== "") || [];

  // --- FUNGSI GENERATE PROMPT JSON ---
  const handleGenerate = () => {
    setIsGenerating(true);
    setShowModal(true);
    setDisplayedPrompt(""); // Reset tampilan

    // Ambil nilai valid (mengutamakan Custom jika dipilih)
    const finalPendekatan = generatorSettings.pendekatan === "Lainnya" ? generatorSettings.customPendekatan : generatorSettings.pendekatan;
    const finalGayaSitasi = generatorSettings.gayaSitasi === "Lainnya" ? generatorSettings.customGayaSitasi : generatorSettings.gayaSitasi;
    const finalLanguage = generatorSettings.language === "Other" ? generatorSettings.customLanguage : generatorSettings.language;
    const finalParagraf = generatorSettings.paragraphLength === "Custom" ? generatorSettings.customParagraphLength : generatorSettings.paragraphLength;
    const finalSentences = generatorSettings.sentenceCount === "Custom" ? generatorSettings.customSentenceCount : generatorSettings.sentenceCount;
    const finalWords = generatorSettings.wordCount === "Custom" ? generatorSettings.customWordCount : generatorSettings.wordCount;

    // Filter sumber referensi yang true
    const activeSources = Object.entries(generatorSettings.sumberReferensi)
      .filter(([_, isTrue]) => isTrue)
      .map(([key]) => key);

    // BENTUK PAYLOAD JSON
    const payload = {
      system_instruction: `You are an expert academic writer. Write Chapter 1 (Introduction) for a thesis. Use ${finalLanguage} language.`,
      thesis_context: {
        title: activeThesis.title,
        department: activeThesis.department,
        degree_level: activeThesis.degreeLevel,
        research_method: {
          approach: finalPendekatan,
        }
      },
      chapter_1_requirements: {
        latar_belakang: {
          include_masalah_utama: generatorSettings.latarBelakang.masalahUtama,
          include_urgensi: generatorSettings.latarBelakang.urgensi,
          include_research_gap: generatorSettings.latarBelakang.researchGap,
          main_problem_description: activeThesis.mainProblem
        },
        identifikasi_masalah: validRPs,
        batasan_penelitian: { count: generatorSettings.batasanCount || 0 },
        rumusan_masalah: validRQs,
        tujuan_penelitian: validROs,
        manfaat_penelitian: { count: generatorSettings.manfaatCount || 0 }
      },
      references: {
        year_limit: generatorSettings.penelitianTerdahulu,
        min_count: generatorSettings.referensiCount || 0,
        required_sources: activeSources,
        citation_style: finalGayaSitasi
      },
      output_formatting: {
        paragraph_length: finalParagraf,
        sentences_per_paragraph: finalSentences,
        words_per_paragraph: finalWords
      }
    };

    const jsonString = JSON.stringify(payload, null, 2);
    setGeneratedPrompt(jsonString);
  };

  // --- EFEK ANIMASI MENGETIK (TYPEWRITER) ---
  useEffect(() => {
    if (isGenerating && generatedPrompt) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedPrompt(generatedPrompt.substring(0, i));
        i += 5; // Kecepatan ngetik (5 karakter per tick)
        if (i > generatedPrompt.length) {
          clearInterval(interval);
          setDisplayedPrompt(generatedPrompt);
          setIsGenerating(false);
        }
      }, 10);
      return () => clearInterval(interval);
    }
  }, [isGenerating, generatedPrompt]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-white p-6 md:p-10 relative">
      
      {/* --- MODAL OUTPUT JSON --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-[#161923] border border-[#2a2d3e] rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl shadow-purple-900/20 transform scale-100 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between p-4 border-b border-[#2a2d3e] bg-[#1a1d27] rounded-t-xl">
              <div className="flex items-center gap-3">
                <Sparkles className="text-purple-500" size={20} />
                <h3 className="font-bold text-lg">Generated Prompt Payload</h3>
                {isGenerating && <span className="flex h-3 w-3 relative ml-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span></span>}
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={copyToClipboard} 
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy JSON"}
                </button>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-red-500/20 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <pre className="text-[13px] text-green-400 font-mono whitespace-pre-wrap leading-relaxed">
                {displayedPrompt}
                {isGenerating && <span className="animate-pulse">_</span>}
              </pre>
            </div>
            
            <div className="p-4 border-t border-[#2a2d3e] bg-[#1a1d27] rounded-b-xl flex justify-end">
               <button 
                 disabled={isGenerating}
                 onClick={() => {
                   setShowModal(false);
                   router.push("/dashboard/agent"); // Arahkan ke AI Tools (Agent)
                 }}
                 className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-md shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
               >
                 Improve Prompt <Wand2 size={16} />
               </button>
            </div>
          </div>
        </div>
      )}

      {/* --- KONTEN UTAMA HALAMAN --- */}
      <div className={`max-w-6xl mx-auto transition-all ${showModal ? 'blur-sm scale-[0.98]' : ''}`}>
        
        {/* HEADER & THESIS SELECTOR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Sparkles className="text-purple-500" /> Thesis Prompt Generator
            </h1>
            <p className="text-gray-400">
              Configure advanced academic parameters to generate high-precision generation payloads.
            </p>
          </div>
          
          <div className="min-w-[250px]">
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase flex items-center gap-1">
              <Database size={12} /> Active Research Context
            </label>
            <div className="relative group">
              <select 
                value={activeThesisId || ""}
                onChange={(e) => setActiveThesis(e.target.value)}
                className="w-full bg-[#1a1d27] border border-purple-500/50 text-purple-100 text-sm rounded-lg p-2.5 appearance-none focus:outline-none focus:border-purple-400 transition-colors cursor-pointer pr-10 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
              >
                {theses.map((t) => (
                  <option key={t.id} value={t.id}>{t.customName}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-purple-400">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* ⚠️ EMPTY STATE WARNING BANNER */}
        {isContextEmpty && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/50 rounded-xl p-4 flex items-start gap-4 animate-in slide-in-from-top-2">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-amber-500 font-bold mb-1">Missing Research Context</h3>
              <p className="text-sm text-amber-200/80 mb-3">
                You have not configured the Title and Main Problem for <strong>{activeThesis.customName}</strong>. 
                The AI requires this context to generate accurate prompts for your research.
              </p>
              <button 
                onClick={() => router.push("/dashboard/profile")}
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs px-4 py-2 rounded-md transition-colors"
              >
                Configure Context Now
              </button>
            </div>
          </div>
        )}

        {/* --- NAVIGATION TABS --- */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2 border-b border-[#2a2d3e] scrollbar-hide">
          <TabButton active={activeChapter === "bab1"} onClick={() => setActiveChapter("bab1")} label="Bab 1: Pendahuluan" />
          <TabButton active={activeChapter === "bab2"} onClick={() => setActiveChapter("bab2")} label="Bab 2: Tinjauan Pustaka" locked />
          <TabButton active={activeChapter === "bab3"} onClick={() => setActiveChapter("bab3")} label="Bab 3: Metodologi" locked />
          <TabButton active={activeChapter === "bab4"} onClick={() => setActiveChapter("bab4")} label="Bab 4: Hasil & Analisis" locked />
          <TabButton active={activeChapter === "bab5"} onClick={() => setActiveChapter("bab5")} label="Bab 5: Kesimpulan" locked />
        </div>

        {/* JIKA BAB 1 (GRATIS) */}
        {activeChapter === "bab1" && (
          <div className={`grid grid-cols-1 gap-10 animate-in fade-in duration-300 ${isContextEmpty ? 'opacity-50 pointer-events-none' : ''}`}>
            
            {/* 1. KONFIGURASI PENELITIAN */}
            <section className="bg-[#161923]/50 p-6 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-3">
                <Settings2 size={18} className="text-purple-500" />
                <h2 className="text-lg font-bold uppercase tracking-wide">Konfigurasi Penelitian</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectGroup 
                  label="Pendekatan" options={["Deskriptif", "Komparatif", "Evaluatif", "Studi Kasus", "Survey", "Eksperimental", "Lainnya"]} 
                  value={generatorSettings.pendekatan} customValue={generatorSettings.customPendekatan}
                  onChange={(val) => updateGeneratorSettings({ pendekatan: val })}
                  onCustomChange={(val) => updateGeneratorSettings({ customPendekatan: val })}
                  disabled={isContextEmpty} 
                />
                <SelectGroup 
                  label="Gaya Sitasi" options={["IEEE", "APA 7th", "Harvard", "MLA", "Lainnya"]} 
                  value={generatorSettings.gayaSitasi} customValue={generatorSettings.customGayaSitasi}
                  onChange={(val) => updateGeneratorSettings({ gayaSitasi: val })}
                  onCustomChange={(val) => updateGeneratorSettings({ customGayaSitasi: val })}
                  disabled={isContextEmpty} 
                />
                <SelectGroup 
                  label="Language" options={["Inggris", "Indonesia", "Other"]} 
                  value={generatorSettings.language} customValue={generatorSettings.customLanguage}
                  onChange={(val) => updateGeneratorSettings({ language: val })}
                  onCustomChange={(val) => updateGeneratorSettings({ customLanguage: val })}
                  disabled={isContextEmpty} 
                />
              </div>
            </section>

            {/* 2. STRUKTUR BAB & SINKRONISASI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-6">
                <section className="bg-[#161923]/50 p-6 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                    <BookOpen size={18} className="text-purple-500" />
                    <h2 className="text-lg font-bold uppercase tracking-wide">Latar Belakang</h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    <CheckboxItem label="Masalah utama" checked={generatorSettings.latarBelakang.masalahUtama} onChange={() => toggleLatarBelakang('masalahUtama')} disabled={isContextEmpty} />
                    <CheckboxItem label="Urgensi" checked={generatorSettings.latarBelakang.urgensi} onChange={() => toggleLatarBelakang('urgensi')} disabled={isContextEmpty} />
                    <CheckboxItem label="Research gap" checked={generatorSettings.latarBelakang.researchGap} onChange={() => toggleLatarBelakang('researchGap')} disabled={isContextEmpty} />
                  </div>
                </section>

                <section className="bg-[#161923]/50 p-6 rounded-xl border border-purple-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-purple-500/20 text-purple-400 text-[10px] font-bold px-2 py-1 rounded-bl-lg">SYNCED</div>
                  <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                    <ListChecks size={18} className="text-purple-500" />
                    <h2 className="text-lg font-bold uppercase tracking-wide">Identifikasi Masalah</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-gray-500">Main Problem:</span>
                      <p className="text-sm text-gray-400 italic line-clamp-3">"{activeThesis.mainProblem || "Belum ada identifikasi masalah di profil."}"</p>
                    </div>
                    {validRPs.length > 0 && (
                      <div className="space-y-2 border-t border-white/5 pt-3">
                        {validRPs.map((rp, idx) => (
                          <div key={`rp-${idx}`}>
                            <span className="text-xs font-bold text-purple-400">RP{idx + 1}:</span>
                            <p className="text-sm text-gray-400 italic line-clamp-2">"{rp}"</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section className="bg-[#161923]/50 p-6 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                    <Layers size={18} className="text-purple-500" />
                    <h2 className="text-lg font-bold uppercase tracking-wide">Batasan & Manfaat</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <NumberInput label="Jumlah Batasan" value={generatorSettings.batasanCount} onChange={(val) => updateGeneratorSettings({ batasanCount: val })} placeholder="Misal: 3" disabled={isContextEmpty} />
                    <NumberInput label="Jumlah Manfaat" value={generatorSettings.manfaatCount} onChange={(val) => updateGeneratorSettings({ manfaatCount: val })} placeholder="Misal: 4" disabled={isContextEmpty} />
                  </div>
                </section>

                <section className="bg-[#161923]/50 p-6 rounded-xl border border-purple-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-purple-500/20 text-purple-400 text-[10px] font-bold px-2 py-1 rounded-bl-lg">SYNCED</div>
                  <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                    <GraduationCap size={18} className="text-purple-500" />
                    <h2 className="text-lg font-bold uppercase tracking-wide">Rumusan & Tujuan</h2>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="space-y-2">
                      {validRQs.length > 0 ? (
                        validRQs.map((rq, idx) => (
                          <div key={`rq-${idx}`}>
                            <span className="text-xs font-bold text-blue-400">RQ{idx + 1}:</span>
                            <p className="text-sm text-gray-400 italic line-clamp-2">"{rq}"</p>
                          </div>
                        ))
                      ) : (
                        <div><span className="text-xs font-bold text-blue-400">RQ:</span><p className="text-sm text-gray-400 italic">"Kosong"</p></div>
                      )}
                    </div>

                    <div className="space-y-2 border-t border-white/5 pt-3">
                      {validROs.length > 0 ? (
                        validROs.map((ro, idx) => (
                          <div key={`ro-${idx}`}>
                            <span className="text-xs font-bold text-green-400">RO{idx + 1}:</span>
                            <p className="text-sm text-gray-400 italic line-clamp-2">"{ro}"</p>
                          </div>
                        ))
                      ) : (
                        <div><span className="text-xs font-bold text-green-400">RO:</span><p className="text-sm text-gray-400 italic">"Kosong"</p></div>
                      )}
                    </div>
                  </div>
                </section>
              </div>

            </div>

            {/* 3. REFERENSI */}
            <section className="bg-[#161923]/50 p-6 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-3">
                <LinkIcon size={18} className="text-purple-500" />
                <h2 className="text-lg font-bold uppercase tracking-wide">Referensi</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <SelectGroup 
                  label="Penelitian Terdahulu" 
                  options={["<5 tahun (2021-2026)", "<6 tahun (2020-2026)", "<7 tahun (2019-2026)", "<8 tahun (2018-2026)", "Tak terhingga"]} 
                  value={generatorSettings.penelitianTerdahulu} customValue=""
                  onChange={(val) => updateGeneratorSettings({ penelitianTerdahulu: val })} onCustomChange={() => {}}
                  disabled={isContextEmpty} 
                />
                <NumberInput label="Jumlah Referensi Minimal" value={generatorSettings.referensiCount} onChange={(val) => updateGeneratorSettings({ referensiCount: val })} placeholder="Misal: 15" disabled={isContextEmpty} />
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-3 ml-1">Sumber Referensi</label>
                  <div className="grid grid-cols-2 gap-3">
                    <CheckboxItem label="Scopus" checked={generatorSettings.sumberReferensi.scopus} onChange={() => toggleSumberReferensi('scopus')} disabled={isContextEmpty} />
                    <CheckboxItem label="SINTA" checked={generatorSettings.sumberReferensi.sinta} onChange={() => toggleSumberReferensi('sinta')} disabled={isContextEmpty} />
                    <CheckboxItem label="Google Scholar" checked={generatorSettings.sumberReferensi.googleScholar} onChange={() => toggleSumberReferensi('googleScholar')} disabled={isContextEmpty} />
                    <CheckboxItem label="Buku Akademik" checked={generatorSettings.sumberReferensi.bukuAkademik} onChange={() => toggleSumberReferensi('bukuAkademik')} disabled={isContextEmpty} />
                    <CheckboxItem label="Conference Paper" checked={generatorSettings.sumberReferensi.conferencePaper} onChange={() => toggleSumberReferensi('conferencePaper')} disabled={isContextEmpty} />
                    <CheckboxItem label="Thesis/Disertasi" checked={generatorSettings.sumberReferensi.thesisDisertasi} onChange={() => toggleSumberReferensi('thesisDisertasi')} disabled={isContextEmpty} />
                  </div>
                </div>
              </div>
            </section>

            {/* 4. OUTPUT */}
            <section className="bg-[#161923]/50 p-6 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-3">
                <FileText size={18} className="text-purple-500" />
                <h2 className="text-lg font-bold uppercase tracking-wide">Output Formatting</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectGroup label="Paragraph Length" options={["Short (3–5 Paragraf)", "Medium (5–8 Paragraf)", "Long (8–12 Paragraf)", "Very Long (12+ Paragraf)", "Custom"]} value={generatorSettings.paragraphLength} customValue={generatorSettings.customParagraphLength} onChange={(val) => updateGeneratorSettings({ paragraphLength: val })} onCustomChange={(val) => updateGeneratorSettings({ customParagraphLength: val })} disabled={isContextEmpty} />
                <SelectGroup label="Sentence Count" options={["Auto", "3–5", "5–8", "8–12", "Custom"]} value={generatorSettings.sentenceCount} customValue={generatorSettings.customSentenceCount} onChange={(val) => updateGeneratorSettings({ sentenceCount: val })} onCustomChange={(val) => updateGeneratorSettings({ customSentenceCount: val })} disabled={isContextEmpty} />
                <SelectGroup label="Word Count" options={["Auto", "80–120", "120–180", "180–250", "Custom"]} value={generatorSettings.wordCount} customValue={generatorSettings.customWordCount} onChange={(val) => updateGeneratorSettings({ wordCount: val })} onCustomChange={(val) => updateGeneratorSettings({ customWordCount: val })} disabled={isContextEmpty} />
              </div>
            </section>

            {/* TOMBOL GENERATE BARU */}
            <div className="mt-8 flex justify-center pb-10">
              <button 
                onClick={handleGenerate}
                disabled={isContextEmpty}
                className={`font-bold py-3 px-10 rounded-full shadow-xl transition-all flex items-center gap-3 group
                  ${isContextEmpty 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/30 active:scale-95'
                  }`}
              >
                <Sparkles size={20} className={!isContextEmpty ? "group-hover:rotate-12 transition-transform" : ""} />
                {isContextEmpty ? "Context Required to Generate" : "Generate Chapter 1 Payload"}
              </button>
            </div>

          </div>
        )}

        {/* JIKA BAB 2 SAMPAI 5 (KONDISI TERKUNCI / BERBAYAR) */}
        {activeChapter !== "bab1" && (
          <div className="min-h-[500px] flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-gradient-to-tr from-yellow-600/20 to-orange-500/20 rounded-full flex items-center justify-center mb-6 border border-yellow-500/30">
              <Crown size={40} className="text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Unlock The Full Potential</h2>
            <p className="text-gray-400 max-w-lg mb-8">
              You are currently viewing <span className="text-white font-bold">{activeChapter.toUpperCase().replace("BAB", "Bab ")}</span>. 
              Upgrade your Theziz AI plan to instantly generate Literature Reviews, Methodology Matrices, and Data Analysis with our Advanced AI Agents.
            </p>
            <div className="flex gap-4">
              <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-3 rounded-full font-semibold transition-colors">
                Learn More
              </button>
              <button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white shadow-lg shadow-yellow-900/30 px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all active:scale-95">
                <Crown size={18} /> Upgrade to Pro
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// --- REUSABLE UI COMPONENTS ---
// (TabButton, SelectGroup, NumberInput, CheckboxItem sama persis seperti sebelumnya)

function TabButton({ active, onClick, label, locked }: { active: boolean, onClick: () => void, label: string, locked?: boolean }) {
  return (
    <button onClick={onClick} className={`px-5 py-3 text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 border-b-2 ${active ? "border-purple-500 text-purple-400 bg-purple-500/5" : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}>
      {label}
      {locked && <Lock size={14} className={active ? "text-purple-400" : "text-gray-600"} />}
    </button>
  );
}

function SelectGroup({ label, options, disabled, value, customValue, onChange, onCustomChange }: { label: string; options: string[]; disabled?: boolean; value: string; customValue: string; onChange: (val: string) => void; onCustomChange: (val: string) => void; }) {
  const isCustom = value === "Custom" || value === "Lainnya" || value === "Other";
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[11px] uppercase tracking-wider font-bold text-gray-500 ml-1">{label}</label>
      <div className="relative group">
        <select value={value} onChange={(e) => { onChange(e.target.value); if (e.target.value !== "Custom" && e.target.value !== "Lainnya" && e.target.value !== "Other") { onCustomChange(""); } }} disabled={disabled} className="w-full bg-[#11131a] border border-[#2a2d3e] text-gray-200 text-sm rounded-lg p-2.5 appearance-none focus:outline-none focus:border-purple-500 transition-colors cursor-pointer pr-10 group-hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-70">
          {options.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500"><ChevronDown size={14} /></div>
      </div>
      {isCustom && (
        <input type="text" value={customValue} onChange={(e) => onCustomChange(e.target.value)} placeholder={`Ketik manual ${label.toLowerCase()}...`} disabled={disabled} className="w-full bg-[#161923] border border-purple-500/50 text-gray-200 text-sm rounded-lg p-2.5 mt-1 focus:outline-none focus:border-purple-500 transition-all animate-in fade-in slide-in-from-top-1 placeholder:text-gray-600 disabled:cursor-not-allowed disabled:opacity-70" autoFocus />
      )}
    </div>
  );
}

function NumberInput({ label, value, onChange, placeholder, disabled }: { label: string, value: number | "", onChange: (val: number | "") => void, placeholder: string, disabled?: boolean }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[11px] uppercase tracking-wider font-bold text-gray-500 ml-1">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")} placeholder={placeholder} disabled={disabled} min={1} className="w-full bg-[#11131a] border border-[#2a2d3e] text-gray-200 text-sm rounded-lg p-2.5 focus:outline-none focus:border-purple-500 transition-colors disabled:cursor-not-allowed disabled:opacity-70 placeholder:text-gray-600" />
    </div>
  );
}

function CheckboxItem({ label, checked, onChange, disabled }: { label: string, checked: boolean, onChange: () => void, disabled?: boolean }) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer group ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="relative flex items-center justify-center">
        <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className="peer appearance-none w-4 h-4 bg-[#11131a] border border-[#2a2d3e] rounded checked:bg-purple-600 checked:border-purple-600 transition-colors" />
        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      </div>
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
    </label>
  );
}