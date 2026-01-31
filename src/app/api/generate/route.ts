import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

// Inisialisasi Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface RequestBody {
  prompt: string;
  settings: {
    model: string; 
    tone: number;  
    length: number; 
    language: 'id' | 'en';
  };
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const { prompt, settings } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'API Key belum dikonfigurasi.' },
        { status: 500 }
      );
    }

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt kosong' }, { status: 400 });
    }

    // --- LOGIKA PROMPT ENGINEERING ---
    let toneInstruction = '';
    if (settings.tone < 30) toneInstruction = 'Santai dan mudah dimengerti.';
    else if (settings.tone > 70) toneInstruction = 'Akademik Formal, objektif, istilah teknis.';
    else toneInstruction = 'Standar laporan sopan.';

    let lengthInstruction = '';
    if (settings.length < 30) lengthInstruction = 'Ringkas (max 300 kata).';
    else if (settings.length > 70) lengthInstruction = 'Mendetail (min 800 kata).';
    else lengthInstruction = 'Proporsional (500 kata).';

    const targetChapter = mapChapterName(settings.model);
    const targetLang = settings.language === 'id' ? 'Bahasa Indonesia' : 'English';

    const finalPrompt = `
      Bertindaklah sebagai Dosen Pembimbing. Tulis draf **${targetChapter}**.
      Topik: "${prompt}"
      Syarat: Bahasa ${targetLang}, Tone ${toneInstruction}, Panjang ${lengthInstruction}.
      Format: Markdown. Langsung ke isi.
    `;

    // --- PERBAIKAN DISINI (Sesuai Library @google/genai Baru) ---
    
    // 1. Jangan pakai destructuring { response }
    // 2. Gunakan model 'gemini-2.0-flash-exp' (Paling baru & support library ini) 
    //    atau 'gemini-1.5-flash' jika sudah stabil.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: finalPrompt,
      config: {
        temperature: 0.7,
      }
    });

    // 3. Akses property .text langsung (bukan function)
    //    Cek jika response.text null/undefined untuk keamanan
    const text = response.text || "Maaf, AI tidak menghasilkan teks.";

    return NextResponse.json({
      success: true,
      result: text,
    });

  } catch (error: any) {
    console.error('AI Error:', error);
    
    // Tangani error spesifik jika model tidak ditemukan
    let errorMessage = error.message || 'Gagal generate teks.';
    if (error.message?.includes('404')) {
        errorMessage = 'Model AI tidak ditemukan. Coba ganti nama model di codingan.';
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

function mapChapterName(code: string): string {
    switch(code) {
        case 'bab1': return 'Bab 1: Pendahuluan';
        case 'bab2': return 'Bab 2: Tinjauan Pustaka';
        case 'bab3': return 'Bab 3: Metodologi';
        case 'bab4': return 'Bab 4: Hasil & Pembahasan';
        case 'bab5': return 'Bab 5: Kesimpulan';
        default: return 'Skripsi';
    }
}