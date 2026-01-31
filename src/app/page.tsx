"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUp, CheckCircle, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 z-100 p-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-500 transition-colors"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const handleLogoClick = (e) => {
  // If we are already on home, scroll to top instead of reloading
  if (window.location.pathname === "/") {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// --- KOMPONEN KECIL (Mascot & Logos) ---

// 2. Logo Partner (Placeholder gaya neon/putih)
const PartnerLogos = () => (
  <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 mt-12">
    {["Zoom", "Netflix", "Airbnb", "Spotify", "Google", "Slack"].map(
      (brand) => (
        <span key={brand} className="text-xl font-bold text-white">
          {brand}
        </span>
      ),
    )}
  </div>
);

// --- SECTIONS UTAMA ---

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="relative w-10 h-10 transition-transform group-hover:scale-110">
              <Image
                src="/logo.png"
                alt="Theziz Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold tracking-tight">Theziz AI</span>
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
            <a href="#" className="hover:text-white transition">
              Fitur
            </a>
            <a href="#" className="hover:text-white transition">
              Cara Kerja
            </a>
            <a href="#" className="hover:text-white transition">
              Testimoni
            </a>
            <a href="#" className="hover:text-white transition">
              Pricing
            </a>
          </div>
          <div className="flex gap-4">
            {/* Tombol Sign In -> Mengarah ke Login */}
            <Link
              href="/auth/login"
              className="text-sm font-medium hover:text-purple-400 transition-colors py-2"
            >
              Sign In
            </Link>

            {/* Tombol Get Started -> Mengarah ke Register */}
            <Link
              href="/auth/register"
              className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Teks Kiri */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-purple-500 font-bold mb-2 tracking-wide uppercase text-sm">
            Theziz AI V2.0
          </h2>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Optimasi <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-cyan-400">
              Riset Akademik.
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-md">
            Theziz hadir untuk merevolusi cara mahasiswa meneliti, menulis, dan
            memvisualisasikan data dengan bantuan AI.
          </p>
          <div className="flex gap-4">
            <button className="bg-linear-to-r from-purple-600 to-blue-600 px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition shadow-[0_0_20px_rgba(124,58,237,0.5)]">
              Mulai Sekarang <ArrowRight size={18} />
            </button>
            <button className="border border-white/20 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-white/5 transition">
              <Play size={18} fill="currentColor" /> Demo
            </button>
          </div>
        </motion.div>

        {/* Visual Kanan (Globe Glowing) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center"
        >
          <div className="absolute inset-0 bg-purple-600 blur-[100px] opacity-30 rounded-full"></div>
          <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full bg-linear-to-b">
            <Image
              src="/image_1.png"
              alt="Theziz Satu"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>
      </section>

      {/* 3. LOGO MARQUEE */}
      <section className="border-y border-white/5 py-10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs text-gray-500 mb-6 uppercase tracking-widest">
            Dipercaya oleh Mahasiswa dari
          </p>
          <PartnerLogos />
        </div>
      </section>

      {/* 4. FEATURE 1 (Text Left, Image Right) */}
      <section className="py-24 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        <div>
          <h3 className="text-blue-400 font-bold mb-2">Penulisan Kilat</h3>
          <h2 className="text-4xl font-bold mb-6">Optimasi Struktur Bab</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Theziz melakukan parsing terhadap ribuan jurnal dalam hitungan
            detik. Membantu Anda menyusun Bab 1 dan Bab 2 dengan argumen yang
            kuat dan referensi valid.
          </p>
          <button className="text-white border-b border-purple-500 pb-1 hover:text-purple-400 transition">
            Pelajari Lebih Lanjut
          </button>
        </div>
        <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full bg-linear-to-b">
          <Image
            src="/image_2.png"
            alt="Theziz Dua"
            fill
            className="object-contain"
            priority
          />
        </div>
      </section>

      {/* 5. FEATURE 2 (Image Left, Text Right) */}
      <section className="py-24 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full bg-linear-to-b">
          <Image
            src="/image_5.png"
            alt="Theziz Dua"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div>
          <h3 className="text-purple-400 font-bold mb-2">Theziz AI</h3>
          <h2 className="text-4xl font-bold mb-6">Analisis Data Otomatis</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Jangan pusing dengan SPSS atau Python. Upload data mentah Anda, dan
            biarkan Theziz memvisualisasikan hasilnya menjadi grafik yang siap
            untuk sidang.
          </p>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center gap-3">
              <CheckCircle size={16} className="text-green-500" /> Otomatisasi
              Regresi
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle size={16} className="text-green-500" /> Visualisasi
              Interaktif
            </li>
          </ul>
        </div>
      </section>

      {/* 6. TESTIMONIAL CARD (Gradient) */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-linear-to-r from-purple-900 to-blue-900 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full"></div>

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white/20 shrink-0 bg-[url('https://i.pravatar.cc/150?img=32')] bg-cover"></div>
            <div>
              <p className="text-xl md:text-2xl font-medium leading-relaxed mb-4">
                "Saya hampir menyerah dengan Bab 4 saya. Theziz membantu saya
                memproses data kualitatif yang berantakan menjadi narasi yang
                koheren hanya dalam 2 jam."
              </p>
              <div>
                <h4 className="font-bold text-white">Amelia Putri</h4>
                <p className="text-purple-200 text-sm">
                  Mahasiswi Pascasarjana, UI
                </p>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8 md:justify-start md:ml-32">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
          </div>
        </div>
      </section>

      {/* 7. FEATURE 3 (Zig Zag lagi) */}
      <section className="py-24 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        <div>
          <h3 className="text-cyan-400 font-bold mb-2">Penulisan Kilat</h3>
          <h2 className="text-4xl font-bold mb-6">Cek Plagiarisme Real-time</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Menulis sambil mengecek orisinalitas. Theziz menjamin tulisan Anda
            unik dan memiliki parafrase tingkat akademik yang tinggi.
          </p>
        </div>
        <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full bg-linear-to-b">
          <Image
            src="/image_4.png"
            alt="Theziz Dua"
            fill
            className="object-contain"
            priority
          />
        </div>
      </section>

      {/* 8. CTA BOTTOM (Gradient Card with Mascot) */}
      <section className="py-20 px-6 mb-20">
        <div className="max-w-6xl mx-auto bg-linear-to-r from-violet-600 via-purple-600 to-cyan-500 rounded-[2.5rem] p-10 md:p-20 relative overflow-hidden shadow-2xl">
          {/* Main Flex Container */}
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-20">
            <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full bg-linear-to-b">
              <Image
                src="/image_4.png"
                alt="Theziz Dua"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* 2. Content Wrapper (Right Side) */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Buat penelitian anda <br className="hidden md:block" /> dengan
                Theziz AI
              </h2>

              <button className="bg-black text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition transform shadow-lg">
                Mulai Gratis Sekarang
              </button>
            </div>
          </div>

          {/* Abstract background shapes */}
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-white/10 pt-16 pb-8 bg-black text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center gap-8 mb-10 grayscale opacity-40">
            {/* Logo kecil ulang di footer */}
            <span className="font-bold">ZOOM</span>
            <span className="font-bold">NETFLIX</span>
            <span className="font-bold">PAYPAL</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 Theziz AI Inc. Dibuat dengan 💜 di Tasikmalaya.
          </p>
        </div>
      </footer>
    </div>
  );
}
