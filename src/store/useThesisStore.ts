import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

// 1. Tipe Data Pesan Chat
export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

// 2. Tipe Data Setting
interface SettingsState {
  model: string;       // Target Bab (Bab 1, Bab 2, dll)
  tone: number;        // Gaya Bahasa (0-100)
  length: number;      // Panjang Output (0-100)
  language: 'id' | 'en';
  aiProvider: 'gemini' | 'groq'; // <--- TAMBAHAN: Pilihan Provider AI
}

// 3. Interface Store Utama
interface ThesisStore {
  // State
  messages: ChatMessage[];
  currentInput: string;
  isLoading: boolean;
  settings: SettingsState;

  // Actions
  addMessage: (role: 'user' | 'ai', content: string) => void;
  setCurrentInput: (val: string) => void;
  setLoading: (loading: boolean) => void;
  setSettings: (settings: Partial<SettingsState>) => void;
  clearHistory: () => void;
  editAndTruncate: (id: string, newContent: string) => void;
}

// 4. Implementasi Store
export const useThesisStore = create<ThesisStore>()(
  devtools(
    persist(
      (set, get) => ({
        // --- State Awal ---
        messages: [],
        currentInput: '',
        isLoading: false,
        settings: { 
          model: 'bab1', 
          tone: 70, 
          length: 50, 
          language: 'id',
          aiProvider: 'gemini', // Default pakai Gemini
        },

        // --- Actions ---
        
        // Tambah pesan baru
        addMessage: (role, content) => set((state) => ({
          messages: [
            ...state.messages, 
            { id: Date.now().toString(), role, content, timestamp: Date.now() }
          ]
        }), false, 'chat/addMessage'),

        // Update input text
        setCurrentInput: (val) => set({ currentInput: val }, false, 'chat/setInput'),

        // Set status loading
        setLoading: (loading) => set({ isLoading: loading }, false, 'chat/setLoading'),

        // Update settings (termasuk ganti provider gemini/groq)
        setSettings: (newSettings) => set((state) => ({ 
          settings: { ...state.settings, ...newSettings } 
        }), false, 'chat/updateSettings'),

        // Hapus semua chat
        clearHistory: () => set({ messages: [] }, false, 'chat/clearHistory'),

        // Edit pesan lama & hapus chat setelahnya (untuk fitur Regenerate)
        editAndTruncate: (id, newContent) => {
            const currentMessages = get().messages;
            const index = currentMessages.findIndex((m) => m.id === id);

            if (index !== -1) {
                // Ambil pesan dari awal sampai pesan yang diedit
                const newHistory = currentMessages.slice(0, index + 1);
                
                // Update konten pesan tersebut dengan teks baru
                newHistory[index] = { 
                  ...newHistory[index], 
                  content: newContent,
                  timestamp: Date.now() // Update timestamp agar fresh
                };

                set({ messages: newHistory }, false, 'chat/editAndTruncate');
            }
        }
      }),
      {
        name: 'theziz-chat-history', // Nama key di LocalStorage
        partialize: (state) => ({ 
          messages: state.messages, 
          settings: state.settings 
        }),
      }
    ),
    { name: 'Thesis Chat Store' }
  )
);