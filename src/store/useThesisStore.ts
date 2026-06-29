// src/store/useThesisStore.ts
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

export interface SettingsState {
  model: string;       
  tone: number;        
  length: number;      
  language: 'id' | 'en';
  aiProvider: 'gemini' | 'groq'; 
}

// 1. UPDATE THESIS DATA INTERFACE (Disesuaikan, researchMethod dihapus)
export interface ThesisData {
  id: string;
  customName: string;
  title: string;
  department: string;  
  degreeLevel: string; 
  mainProblem: string;
  rp: string[];
  rq: string[];
  ro: string[];
}

// 2. TAMBAHAN: INTERFACE UNTUK SETTING GENERATOR
export interface GeneratorSettings {
  pendekatan: string;
  gayaSitasi: string;
  language: string;
  paragraphLength: string;
  sentenceCount: string;
  wordCount: string;
  
  // Custom inputs
  customPendekatan: string;
  customGayaSitasi: string;
  customLanguage: string;
  customParagraphLength: string;
  customSentenceCount: string;
  customWordCount: string;

  latarBelakang: {
    masalahUtama: boolean;
    urgensi: boolean;
    researchGap: boolean;
  };
  
  batasanCount: number | "";
  manfaatCount: number | "";
  
  penelitianTerdahulu: string;
  referensiCount: number | "";
  sumberReferensi: {
    scopus: boolean;
    sinta: boolean;
    googleScholar: boolean;
    bukuAkademik: boolean;
    conferencePaper: boolean;
    thesisDisertasi: boolean;
  };
}

interface ThesisStore {
  messages: ChatMessage[];
  currentInput: string;
  isLoading: boolean;
  settings: SettingsState;
  theses: ThesisData[];
  activeThesisId: string;
  generatorSettings: GeneratorSettings; // <-- Ditambahkan ke Store

  addMessage: (role: 'user' | 'ai', content: string) => void;
  setCurrentInput: (val: string) => void;
  setLoading: (loading: boolean) => void;
  setSettings: (settings: Partial<SettingsState>) => void;
  clearHistory: () => void;
  editAndTruncate: (id: string, newContent: string) => void;

  setActiveThesis: (id: string) => void;
  updateThesis: (id: string, data: Partial<ThesisData>) => void;
  addThesis: () => void;
  deleteThesis: (id: string) => void;
  
  updateGeneratorSettings: (settings: Partial<GeneratorSettings>) => void; // <-- Action baru
}

// 3. INITIAL DATA
const initialTheses: ThesisData[] = [
  {
    id: "thesis-1", 
    customName: "Main Thesis (AI Video)",
    title: "", 
    department: "Informatika", 
    degreeLevel: "S1",         
    mainProblem: "", 
    rp: [""], 
    rq: [""],
    ro: [""]
  }
];

const initialGeneratorSettings: GeneratorSettings = {
  pendekatan: "Deskriptif",
  gayaSitasi: "IEEE",
  language: "Inggris",
  paragraphLength: "Short (3–5 Paragraf)",
  sentenceCount: "Auto",
  wordCount: "Auto",
  customPendekatan: "",
  customGayaSitasi: "",
  customLanguage: "",
  customParagraphLength: "",
  customSentenceCount: "",
  customWordCount: "",
  latarBelakang: { masalahUtama: true, urgensi: true, researchGap: false },
  batasanCount: "",
  manfaatCount: "",
  penelitianTerdahulu: "<5 tahun (2021-2026)",
  referensiCount: "",
  sumberReferensi: { scopus: true, sinta: true, googleScholar: true, bukuAkademik: false, conferencePaper: false, thesisDisertasi: false }
};

export const useThesisStore = create<ThesisStore>()(
  devtools(
    persist(
      (set, get) => ({
        messages: [],
        currentInput: '',
        isLoading: false,
        settings: { 
          model: 'bab1', 
          tone: 70, 
          length: 50, 
          language: 'id',
          aiProvider: 'gemini', 
        },
        theses: initialTheses,
        activeThesisId: "thesis-1",
        generatorSettings: initialGeneratorSettings, // <-- Masukkan default setting

        addMessage: (role, content) => set((state) => ({
          messages: [
            ...state.messages, 
            { id: Date.now().toString(), role, content, timestamp: Date.now() }
          ]
        }), false, 'chat/addMessage'),

        setCurrentInput: (val) => set({ currentInput: val }, false, 'chat/setInput'),
        setLoading: (loading) => set({ isLoading: loading }, false, 'chat/setLoading'),
        setSettings: (newSettings) => set((state) => ({ 
          settings: { ...state.settings, ...newSettings } 
        }), false, 'chat/updateSettings'),
        clearHistory: () => set({ messages: [] }, false, 'chat/clearHistory'),

        editAndTruncate: (id, newContent) => {
            const currentMessages = get().messages;
            const index = currentMessages.findIndex((m) => m.id === id);

            if (index !== -1) {
                const newHistory = currentMessages.slice(0, index + 1);
                newHistory[index] = { 
                  ...newHistory[index], 
                  content: newContent,
                  timestamp: Date.now() 
                };
                set({ messages: newHistory }, false, 'chat/editAndTruncate');
            }
        },

        setActiveThesis: (id) => set({ activeThesisId: id }, false, 'thesis/setActive'),
        
        updateThesis: (id, data) => set((state) => ({
          theses: state.theses.map((t) => (t.id === id ? { ...t, ...data } : t))
        }), false, 'thesis/updateData'),

        addThesis: () => set((state) => {
          if (state.theses.length >= 5) return state; 
          
          const newId = `thesis-${Date.now()}`;
          const newThesis = {
            id: newId, 
            customName: `New Workspace ${state.theses.length + 1}`,
            title: "", department: "", degreeLevel: "", mainProblem: "", 
            rp: [""], rq: [""], ro: [""]
          };
          
          return { 
            theses: [...state.theses, newThesis], 
            activeThesisId: newId 
          };
        }, false, 'thesis/add'),

        deleteThesis: (id) => set((state) => {
          if (id === 'thesis-1') return state; 
          
          const newTheses = state.theses.filter(t => t.id !== id);
          const newActiveId = state.activeThesisId === id ? 'thesis-1' : state.activeThesisId;
          
          return { theses: newTheses, activeThesisId: newActiveId };
        }, false, 'thesis/delete'),

        // <-- FUNGSI UNTUK UPDATE GENERATOR SETTINGS
        updateGeneratorSettings: (newSettings) => set((state) => ({
          generatorSettings: { ...state.generatorSettings, ...newSettings }
        }), false, 'generator/updateSettings'),

      }),
      {
        name: 'theziz-workspace-storage', 
        partialize: (state) => ({ 
          messages: state.messages, 
          settings: state.settings,
          theses: state.theses,
          activeThesisId: state.activeThesisId,
          generatorSettings: state.generatorSettings // <-- Pastikan ini ikut di-save ke LocalStorage
        }),
      }
    ),
    { name: 'Theziz Workspace Store' }
  )
);