import { AlertCircle, CheckCircle2, FileText, MessageSquare, RefreshCcw, Layers } from 'lucide-react';

const challenges = [
  {
    pain: "Mahasiswa bingung mulai skripsi",
    solution: "Smart Roadmap: Theziz memberikan panduan langkah-demi-langkah dari judul hingga daftar pustaka.",
    icon: <AlertCircle className="text-red-500" />
  },
  {
    pain: "Tidak tahu struktur BAB",
    solution: "Auto-Structure: Template otomatis yang menyesuaikan dengan pedoman akademik kampus Anda.",
    icon: <Layers className="text-red-500" />
  },
  {
    pain: "Revisi dosen berulang",
    solution: "Academic Validator: AI yang mengecek koherensi argumen agar sesuai ekspektasi dosen pembimbing.",
    icon: <RefreshCcw className="text-red-500" />
  },
  {
    pain: "Prompt ChatGPT berantakan",
    solution: "Structured Prompting: Metodologi bawaan yang menjamin output AI selalu bersifat ilmiah dan formal.",
    icon: <MessageSquare className="text-red-500" />
  }
];

export default function ThesisBlueprintPage() {
  return (
    <section className="py-24 bg-black text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Skripsi Bukan Lagi <span className="text-red-500">Mimpi Buruk.</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Theziz hadir untuk menyelesaikan hambatan terbesar dalam perjalanan akademik Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {challenges.map((item, index) => (
            <div 
              key={index} 
              className="group p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/[0.08] transition-all duration-300"
            >
              <div className="flex gap-6">
                {/* Bagian Pain (Masalah) */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-red-400 font-semibold mb-2">
                    {item.icon}
                    <span>Masalah</span>
                  </div>
                  <p className="text-xl font-bold mb-4 text-gray-200">{item.pain}</p>
                  
                  <div className="h-[1px] w-full bg-white/10 my-4"></div>

                  {/* Bagian Solution (Solusi Theziz) */}
                  <div className="flex items-center gap-2 text-green-400 font-semibold mb-2">
                    <CheckCircle2 size={20} />
                    <span>Solusi Theziz</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed italic">
                    "{item.solution}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}