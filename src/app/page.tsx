import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 border-b">
        <h1 className="text-2xl font-bold tracking-tighter">
          THEZIZ<span className="text-blue-600">.ai</span>
        </h1>
        <div className="space-x-6 font-medium">
          <Link href="/pricing" className="hover:text-blue-600">
            Pricing
          </Link>
          <Link
            href="/login"
            className="bg-black text-white px-4 py-2 rounded-full"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto text-center mt-20 px-4">
        <h2 className="text-6xl font-extrabold leading-tight mb-6">
          Selesaikan Skripsi <br />
          <span className="text-blue-600">10x Lebih Cepat</span> Dengan AI.
        </h2>
        <p className="text-xl text-gray-600 mb-10">
          Theziz membantu mahasiswa mengintegrasikan berbagai model AI untuk
          riset, penulisan bab, hingga visualisasi data dalam satu dashboard
          terpadu.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/workspace/demo"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-blue-700 transition"
          >
            Buka Workspace AI
          </Link>
          <button className="border border-gray-300 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-50">
            Lihat Demo Video
          </button>
        </div>

        {/* Feature Preview */}
        <div className="mt-20 p-8 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Integrasi API AI
          </p>
          <div className="flex justify-center gap-10 grayscale opacity-60">
            <span className="text-xl font-bold">GPT-4o</span>
            <span className="text-xl font-bold">Gemini 1.5</span>
            <span className="text-xl font-bold">Claude 3.5</span>
            <span className="text-xl font-bold">Midtrans</span>
          </div>
        </div>
      </main>
    </div>
  );
}
