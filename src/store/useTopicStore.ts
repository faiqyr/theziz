// src/store/useTopicStore.ts
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface TopicFormSettings {
  broadField: string;
  customField: string;
  discipline: string;
  studyLevel: string;
  interest: string;
  topicCount: number;
  trendFocus: string;
  methodology: string;
  region: string;
  avoidTopics: string;
}

export interface TopicGeneratorState {
  formSettings: TopicFormSettings;
  generatedPrompt: string;
  lastGeneratedAt: number | null;

  updateFormSettings: (patch: Partial<TopicFormSettings>) => void;
  setGeneratedPrompt: (prompt: string) => void;
  resetForm: () => void;
  resetAll: () => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const initialFormSettings: TopicFormSettings = {
  broadField: '',
  customField: '',
  discipline: 'Any',
  studyLevel: "Master's",
  interest: '',
  topicCount: 5,
  trendFocus: 'Any',
  methodology: 'Any',
  region: 'Global',
  avoidTopics: '',
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useTopicStore = create<TopicGeneratorState>()(
  devtools(
    persist(
      (set) => ({
        formSettings: initialFormSettings,
        generatedPrompt: '',
        lastGeneratedAt: null,

        updateFormSettings: (patch) =>
          set(
            (state) => ({
              formSettings: { ...state.formSettings, ...patch },
            }),
            false,
            'topic/updateFormSettings'
          ),

        setGeneratedPrompt: (prompt) =>
          set(
            { generatedPrompt: prompt, lastGeneratedAt: Date.now() },
            false,
            'topic/setGeneratedPrompt'
          ),

        resetForm: () =>
          set(
            { formSettings: initialFormSettings },
            false,
            'topic/resetForm'
          ),

        resetAll: () =>
          set(
            {
              formSettings: initialFormSettings,
              generatedPrompt: '',
              lastGeneratedAt: null,
            },
            false,
            'topic/resetAll'
          ),
      }),
      {
        name: 'theziz-topic-storage',
        partialize: (state) => ({
          formSettings: state.formSettings,
          generatedPrompt: state.generatedPrompt,
          lastGeneratedAt: state.lastGeneratedAt,
        }),
      }
    ),
    { name: 'Theziz Topic Store' }
  )
);