// src/store/useFieldStore.ts
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface FieldSections {
  background: boolean;
  gap: boolean;
  rq: boolean;
  objective: boolean;
  lit: boolean;
  method: boolean;
  contrib: boolean;
  limit: boolean;
}

export interface FieldAcceptedSources {
  scopus: boolean;
  wos: boolean;
  scholar: boolean;
  arxiv: boolean;
  books: boolean;
  conf: boolean;
}

export interface FieldFormSettings {
  // Research context
  topic: string;
  discipline: string;
  scope: string;
  problemStatement: string;

  // Keywords & sub-topics (stored as comma-joined strings for LocalStorage simplicity)
  keywords: string[];
  subTopics: string[];

  // Methodology
  approach: string;
  level: string;
  outputType: string;

  // References
  citationStyle: string;
  yearRange: string;
  minReferences: number | '';
  acceptedSources: FieldAcceptedSources;

  // Content sections
  sections: FieldSections;

  // Language & format
  language: string;
  writingStyle: string;
  detailLevel: string;
}

export interface FieldGeneratorState {
  formSettings: FieldFormSettings;
  generatedPayload: string; // JSON string hasil generate
  lastGeneratedAt: number | null;

  updateFormSettings: (patch: Partial<FieldFormSettings>) => void;
  toggleSection: (key: keyof FieldSections) => void;
  toggleSource: (key: keyof FieldAcceptedSources) => void;
  addKeyword: (keyword: string) => void;
  removeKeyword: (index: number) => void;
  addSubTopic: (subtopic: string) => void;
  removeSubTopic: (index: number) => void;
  setGeneratedPayload: (payload: string) => void;
  resetForm: () => void;
  resetAll: () => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const initialSections: FieldSections = {
  background: true,
  gap: true,
  rq: true,
  objective: true,
  lit: false,
  method: false,
  contrib: false,
  limit: false,
};

const initialSources: FieldAcceptedSources = {
  scopus: true,
  wos: false,
  scholar: true,
  arxiv: false,
  books: false,
  conf: false,
};

const initialFormSettings: FieldFormSettings = {
  topic: '',
  discipline: 'Computer Science',
  scope: 'Medium (sub-field)',
  problemStatement: '',
  keywords: [],
  subTopics: [],
  approach: 'Quantitative',
  level: "Master's",
  outputType: 'Journal Article',
  citationStyle: 'APA 7th',
  yearRange: 'Last 5 years',
  minReferences: 15,
  acceptedSources: initialSources,
  sections: initialSections,
  language: 'English',
  writingStyle: 'Academic formal',
  detailLevel: 'Standard',
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useFieldStore = create<FieldGeneratorState>()(
  devtools(
    persist(
      (set) => ({
        formSettings: initialFormSettings,
        generatedPayload: '',
        lastGeneratedAt: null,

        updateFormSettings: (patch) =>
          set(
            (state) => ({
              formSettings: { ...state.formSettings, ...patch },
            }),
            false,
            'field/updateFormSettings'
          ),

        toggleSection: (key) =>
          set(
            (state) => ({
              formSettings: {
                ...state.formSettings,
                sections: {
                  ...state.formSettings.sections,
                  [key]: !state.formSettings.sections[key],
                },
              },
            }),
            false,
            'field/toggleSection'
          ),

        toggleSource: (key) =>
          set(
            (state) => ({
              formSettings: {
                ...state.formSettings,
                acceptedSources: {
                  ...state.formSettings.acceptedSources,
                  [key]: !state.formSettings.acceptedSources[key],
                },
              },
            }),
            false,
            'field/toggleSource'
          ),

        addKeyword: (keyword) =>
          set(
            (state) => {
              const trimmed = keyword.trim();
              if (!trimmed || state.formSettings.keywords.includes(trimmed)) {
                return state;
              }
              return {
                formSettings: {
                  ...state.formSettings,
                  keywords: [...state.formSettings.keywords, trimmed],
                },
              };
            },
            false,
            'field/addKeyword'
          ),

        removeKeyword: (index) =>
          set(
            (state) => ({
              formSettings: {
                ...state.formSettings,
                keywords: state.formSettings.keywords.filter((_, i) => i !== index),
              },
            }),
            false,
            'field/removeKeyword'
          ),

        addSubTopic: (subtopic) =>
          set(
            (state) => {
              const trimmed = subtopic.trim();
              if (!trimmed || state.formSettings.subTopics.includes(trimmed)) {
                return state;
              }
              return {
                formSettings: {
                  ...state.formSettings,
                  subTopics: [...state.formSettings.subTopics, trimmed],
                },
              };
            },
            false,
            'field/addSubTopic'
          ),

        removeSubTopic: (index) =>
          set(
            (state) => ({
              formSettings: {
                ...state.formSettings,
                subTopics: state.formSettings.subTopics.filter((_, i) => i !== index),
              },
            }),
            false,
            'field/removeSubTopic'
          ),

        setGeneratedPayload: (payload) =>
          set(
            { generatedPayload: payload, lastGeneratedAt: Date.now() },
            false,
            'field/setGeneratedPayload'
          ),

        resetForm: () =>
          set(
            { formSettings: initialFormSettings },
            false,
            'field/resetForm'
          ),

        resetAll: () =>
          set(
            {
              formSettings: initialFormSettings,
              generatedPayload: '',
              lastGeneratedAt: null,
            },
            false,
            'field/resetAll'
          ),
      }),
      {
        name: 'theziz-field-storage',
        partialize: (state) => ({
          formSettings: state.formSettings,
          generatedPayload: state.generatedPayload,
          lastGeneratedAt: state.lastGeneratedAt,
        }),
      }
    ),
    { name: 'Theziz Field Store' }
  )
);