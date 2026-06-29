import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai'; // Library Terbaru
import Groq from "groq-sdk"; 

export async function POST(req: Request) {
  try {
    const { prompt, settings } = await req.json();
    
    // Default config
    const provider = settings?.aiProvider || 'gemini'; 
    const targetBab = settings?.model || 'Umum';
    const bahasa = settings?.language === 'id' ? 'Indonesia' : 'Inggris';
    
    // Konversi Tone ke Text
    let toneText = 'Standar';
    if (settings?.tone > 70) toneText = 'Sangat Formal Akademik';
    else if (settings?.tone < 30) toneText = 'Santai dan Mudah Dipahami';

    // Instruksi Sistem (Dipakai kedua AI)
    const systemPrompt = `
      Bertindaklah sebagai Dosen Pembimbing Skripsi Profesional.
      Tugas: Tuliskan konten draf skripsi untuk bagian: ${targetBab}.
      Bahasa: ${bahasa}.
      Gaya Bahasa: ${toneText}.
      Instruksi:
      1. Jawab langsung dengan isi konten (Markdown).
      2. Gunakan Heading, Bold, dan Bullet Points agar rapi.
      3. Jangan gunakan kalimat pembuka basa-basi.
    `;

    // ==========================================
    // OPSI 1: GROQ (Llama 3) - GRATIS & CEPAT
    // ==========================================
    if (provider === 'groq') {
        const groqApiKey = process.env.GROQ_API_KEY;
        if (!groqApiKey) return NextResponse.json({ error: "API Key Groq tidak ditemukan" }, { status: 500 });

        const groq = new Groq({ apiKey: groqApiKey });

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ],
            model: "llama-3.1-8b-instant", 
            temperature: 0.7,
            max_tokens: 4000,
        });

        return NextResponse.json({ 
            success: true, 
            result: chatCompletion.choices[0]?.message?.content || "" 
        });
    }

    // ==========================================
    // OPSI 2: GEMINI (Via @google/genai)
    // ==========================================
    else {
        const googleKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
        if (!googleKey) return NextResponse.json({ error: "API Key Google tidak ditemukan" }, { status: 500 });

        // Inisialisasi Client Baru
        const ai = new GoogleGenAI({ apiKey: googleKey });
        
        // Gunakan model yang Anda sebutkan berhasil
        // Jika gemini-3-flash-preview gagal, coba 'gemini-2.0-flash-exp' atau 'gemini-1.5-flash'
        const modelName = "gemini-1.5-flash"; 

        // SINTAKS BARU (@google/genai)
        const response = await ai.models.generateContent({
            model: modelName,
            contents: [
                { role: 'user', parts: [{ text: systemPrompt + "\n\nTopik: " + prompt }] }
            ],
            config: {
                temperature: 0.7,
                maxOutputTokens: 4000,
            }
        });

        // Cara ambil text di library baru
        const textResult = response.text(); 
        
        return NextResponse.json({ 
            success: true, 
            result: textResult 
        });
    }

  } catch (error: any) {
    console.error("AI API Error:", error);
    return NextResponse.json({ 
        error: error.message || "Gagal memproses permintaan AI." 
    }, { status: 500 });
  }
}