"use client";

import { useState, useEffect } from "react";
import { Search, ExternalLink, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

interface Journal {
  id: string;
  title: string;
  sinta_level: number;
  institution: string;
  ojs_url: string;
  is_free: boolean;
  publication_fee: number;
  currency: string;
  notes: string;
  last_updated: string;
}

export default function JournalDashboard() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sintaLevel, setSintaLevel] = useState<number>(4);
  const [feeFilter, setFeeFilter] = useState<string>("all");

  const fetchJournals = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `http://localhost:8000/api/v1/journals?sinta_level=${sintaLevel}`;
      
      if (feeFilter === "free") {
        url += `&max_fee=0`;
      } else if (feeFilter === "under500k") {
        url += `&max_fee=500000`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Gagal mengambil data dari server");
      
      const data = await res.json();
      setJournals(data);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, [sintaLevel, feeFilter]);

  const handleRunScraper = async () => {
    if (!confirm("Ini akan memakan waktu untuk menjalankan bot scraper & AI. Lanjutkan?")) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/scraper/run?sinta_level=${sintaLevel}`, {
        method: "POST"
      });
      if (!res.ok) throw new Error("Gagal menjalankan worker");
      alert("Worker berhasil dijalankan. Silakan refresh (fetch ulang) setelah beberapa detik.");
      fetchJournals();
    } catch (err: any) {
      alert("Error: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Search className="text-purple-400" /> Pencari Jurnal SINTA
          </h1>
          <p className="text-gray-400 mt-2">
            Temukan jurnal target untuk skripsi Anda. Data biaya diekstrak otomatis oleh AI.
          </p>
        </div>
        <button 
          onClick={handleRunScraper}
          className="flex items-center gap-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 px-4 py-2 rounded-xl hover:bg-purple-600/30 transition-colors"
        >
          <RefreshCw size={16} /> Jalankan Worker
        </button>
      </div>

      {/* FILTER SECTION */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-400 mb-2">Tingkat SINTA</label>
          <select 
            value={sintaLevel}
            onChange={(e) => setSintaLevel(Number(e.target.value))}
            className="w-full bg-black border border-white/20 text-white rounded-xl px-4 py-2.5 focus:border-purple-500 outline-none transition-colors"
          >
            {[1, 2, 3, 4, 5, 6].map(level => (
              <option key={level} value={level}>SINTA {level}</option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-400 mb-2">Estimasi Biaya (APC)</label>
          <select 
            value={feeFilter}
            onChange={(e) => setFeeFilter(e.target.value)}
            className="w-full bg-black border border-white/20 text-white rounded-xl px-4 py-2.5 focus:border-purple-500 outline-none transition-colors"
          >
            <option value="all">Semua Biaya</option>
            <option value="free">Gratis (Rp 0)</option>
            <option value="under500k">Di bawah Rp 500.000</option>
          </select>
        </div>
      </div>

      {/* CONTENT SECTION */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#111] border border-white/5 rounded-2xl h-48 animate-pulse p-6">
               <div className="h-6 bg-white/10 rounded-md w-3/4 mb-4"></div>
               <div className="h-4 bg-white/5 rounded-md w-1/2 mb-8"></div>
               <div className="h-10 bg-white/10 rounded-xl w-full mt-auto"></div>
            </div>
          ))}
        </div>
      ) : journals.length === 0 ? (
        <div className="text-center py-20 bg-[#111] rounded-2xl border border-white/5">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-500" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Tidak ada jurnal ditemukan</h3>
          <p className="text-gray-400">Coba ubah filter atau jalankan bot Scraper.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {journals.map((journal) => (
            <div key={journal.id} className="bg-[#111] hover:bg-[#161616] border border-white/5 hover:border-white/20 transition-all rounded-2xl p-6 flex flex-col h-full group">
              <div className="flex justify-between items-start mb-4 gap-2">
                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  SINTA {journal.sinta_level}
                </span>
                
                {journal.is_free ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                    <CheckCircle2 size={12} /> GRATIS / FREE APC
                  </span>
                ) : journal.publication_fee > 0 ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    {journal.currency} {journal.publication_fee.toLocaleString('id-ID')}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30">
                    Mengecek AI...
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                {journal.title}
              </h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                {journal.institution}
              </p>
              
              {journal.notes && (
                <div className="text-xs text-gray-500 bg-white/5 p-3 rounded-lg mb-4 italic line-clamp-2 border border-white/5">
                  AI Note: {journal.notes}
                </div>
              )}

              <div className="mt-auto pt-4">
                <Link 
                  href={journal.ojs_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-black hover:bg-gray-200 font-medium rounded-xl transition-colors text-sm"
                >
                  Kunjungi OJS Jurnal <ExternalLink size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
