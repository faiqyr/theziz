import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';

export const AIOrchestrator = {
  // Method untuk menulis teks skripsi (Gemini)
  generateThesisChapter: async (prompt: string) => {
    return streamText({
      model: google('models/gemini-1.5-flash'),
      system: "Anda adalah pakar penulisan skripsi akademik Theziz.",
      prompt: prompt,
    });
  },

  // Placeholder untuk AI Animasi (Contoh integrasi API pihak ke-3)
  generateVisualAid: async (description: string) => {
    // Di sini nanti panggil API seperti Runway atau Leonardo
    return { url: "https://api.provider.com/generate", status: "processing" };
  }
};