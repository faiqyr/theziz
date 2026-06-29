"use client";

import { useState, useEffect, useRef } from "react";
import {
  Telescope, BookOpen, FlaskConical, Tag, LayoutList, Book,
  FileText, Sparkles, Copy, Check, X, ArrowRight
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Settings {
  topic: string;
  discipline: string;
  scope: string;
  problemStatement: string;
  keywords: string[];
  subTopics: string[];
  level: string;
  outputType: string;
  approach: string;
  citationStyle: string;
  yearRange: string;
  minReferences: number | "";
  acceptedSources: Record<string, boolean>;
  sections: Record<string, boolean>;
  language: string;
  writingStyle: string;
  detailLevel: string;
}

const DEFAULT_SETTINGS: Settings = {
  topic: "",
  discipline: "Computer Science",
  scope: "Medium (sub-field)",
  problemStatement: "",
  keywords: [],
  subTopics: [],
  level: "Master's",
  outputType: "Journal Article",
  approach: "Quantitative",
  citationStyle: "APA 7th",
  yearRange: "Last 5 years",
  minReferences: 15,
  acceptedSources: {
    scopus: true,
    wos: false,
    scholar: true,
    arxiv: false,
    books: false,
    conf: false,
  },
  sections: {
    background: true,
    gap: true,
    rq: true,
    objective: true,
    lit: false,
    method: false,
    contrib: false,
    limit: false,
  },
  language: "English",
  writingStyle: "Academic formal",
  detailLevel: "Standard",
};

const SOURCE_LABELS: Record<string, string> = {
  scopus: "Scopus",
  wos: "Web of Science",
  scholar: "Google Scholar",
  arxiv: "arXiv (preprints)",
  books: "Academic books",
  conf: "Conference papers",
};

const SECTION_LABELS: Record<string, string> = {
  background: "Background & context",
  gap: "Research gap analysis",
  rq: "Research questions",
  objective: "Objectives & outcomes",
  lit: "Literature synthesis",
  method: "Methodology outline",
  contrib: "Expected contributions",
  limit: "Scope & limitations",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ResearchFieldPromptGenerator() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [keywordInput, setKeywordInput] = useState("");
  const [subtopicInput, setSubtopicInput] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [generatedJSON, setGeneratedJSON] = useState("");
  const [displayedJSON, setDisplayedJSON] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const update = (patch: Partial<Settings>) =>
    setSettings((s) => ({ ...s, ...patch }));

  const toggleSource = (key: string) =>
    update({ acceptedSources: { ...settings.acceptedSources, [key]: !settings.acceptedSources[key] } });

  const toggleSection = (key: string) =>
    update({ sections: { ...settings.sections, [key]: !settings.sections[key] } });

  const addKeyword = () => {
    const val = keywordInput.trim();
    if (!val || settings.keywords.includes(val)) return;
    update({ keywords: [...settings.keywords, val] });
    setKeywordInput("");
  };

  const removeKeyword = (idx: number) =>
    update({ keywords: settings.keywords.filter((_, i) => i !== idx) });

  const addSubtopic = () => {
    const val = subtopicInput.trim();
    if (!val || settings.subTopics.includes(val)) return;
    update({ subTopics: [...settings.subTopics, val] });
    setSubtopicInput("");
  };

  const removeSubtopic = (idx: number) =>
    update({ subTopics: settings.subTopics.filter((_, i) => i !== idx) });

  const buildPayload = () => {
    const activeSections = Object.entries(settings.sections)
      .filter(([, v]) => v)
      .map(([k]) => SECTION_LABELS[k]);

    const activeSources = Object.entries(settings.acceptedSources)
      .filter(([, v]) => v)
      .map(([k]) => SOURCE_LABELS[k]);

    return {
      system_instruction: `You are an expert academic researcher and writer. Generate structured research content for the specified field. Use ${settings.language} language with a ${settings.writingStyle} tone.`,
      research_context: {
        topic: settings.topic || "Not specified",
        discipline: settings.discipline,
        scope: settings.scope,
        problem_statement: settings.problemStatement || null,
        keywords: settings.keywords,
        sub_topics: settings.subTopics,
        level: settings.level,
        output_type: settings.outputType,
        methodology: { approach: settings.approach },
      },
      content_requirements: {
        sections_to_generate: activeSections,
        detail_level: settings.detailLevel,
      },
      reference_parameters: {
        citation_style: settings.citationStyle,
        year_range: settings.yearRange,
        minimum_references: settings.minReferences || 0,
        accepted_sources: activeSources,
      },
      output_language: settings.language,
      writing_style: settings.writingStyle,
    };
  };

  const handleGenerate = () => {
    const json = JSON.stringify(buildPayload(), null, 2);
    setGeneratedJSON(json);
    setDisplayedJSON("");
    setIsGenerating(true);
    setShowModal(true);
    setCopied(false);
  };

  // Typewriter effect
  useEffect(() => {
    if (!isGenerating || !generatedJSON) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedJSON(generatedJSON.substring(0, i));
      i += 5;
      if (i > generatedJSON.length) {
        clearInterval(interval);
        setDisplayedJSON(generatedJSON);
        setIsGenerating(false);
      }
    }, 10);
    return () => clearInterval(interval);
  }, [isGenerating, generatedJSON]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedJSON);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-white p-6 md:p-10">

      {/* ── MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#161923] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#1a1d27] rounded-t-2xl">
              <div className="flex items-center gap-3">
                <Sparkles className="text-purple-400" size={18} />
                <h3 className="font-semibold text-base">Generated Prompt Payload</h3>
                {isGenerating && (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium transition-colors disabled:opacity-40"
                >
                  {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                  {copied ? "Copied!" : "Copy JSON"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <pre className="text-[13px] text-emerald-400 font-mono whitespace-pre-wrap leading-relaxed">
                {displayedJSON}
                {isGenerating && <span className="animate-pulse">▍</span>}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-[#1a1d27] rounded-b-2xl flex justify-end">
              <button
                disabled={isGenerating}
                onClick={() => setShowModal(false)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2 px-5 rounded-xl text-sm transition-colors"
              >
                Use in AI Agent <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className={`max-w-5xl mx-auto transition-all ${showModal ? "blur-sm scale-[0.98]" : ""}`}>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <Telescope className="text-purple-500" size={28} />
            Research Field Prompt Generator
          </h1>
          <p className="text-gray-400 text-sm">
            Configure your research field parameters and generate a structured AI prompt payload.
          </p>
        </div>

        <div className="space-y-6">

          {/* ── 1. Research Context ── */}
          <Section icon={<BookOpen size={16} className="text-purple-500" />} title="Research context">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <FieldLabel>Research field / topic</FieldLabel>
                <input
                  className={inputCls}
                  value={settings.topic}
                  onChange={(e) => update({ topic: e.target.value })}
                  placeholder="e.g. Machine Learning for Climate Prediction"
                />
              </div>
              <div>
                <FieldLabel>Discipline</FieldLabel>
                <select className={inputCls} value={settings.discipline} onChange={(e) => update({ discipline: e.target.value })}>
                  {["Computer Science","Biomedical Engineering","Social Sciences","Environmental Science","Economics","Physics","Medicine","Education","Law","Other"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel>Scope</FieldLabel>
                <select className={inputCls} value={settings.scope} onChange={(e) => update({ scope: e.target.value })}>
                  {["Narrow (focused niche)","Medium (sub-field)","Broad (entire field)","Interdisciplinary"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <FieldLabel>Research problem / objective</FieldLabel>
                <textarea
                  className={`${inputCls} min-h-[80px] resize-y`}
                  value={settings.problemStatement}
                  onChange={(e) => update({ problemStatement: e.target.value })}
                  placeholder="Describe the core problem, gap, or objective this research addresses..."
                />
              </div>
            </div>
          </Section>

          {/* ── 2. Methodology ── */}
          <Section icon={<FlaskConical size={16} className="text-purple-500" />} title="Methodology & approach">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FieldLabel>Research approach</FieldLabel>
                <select className={inputCls} value={settings.approach} onChange={(e) => update({ approach: e.target.value })}>
                  {["Quantitative","Qualitative","Mixed Methods","Computational","Experimental","Observational","Systematic Review","Meta-analysis"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel>Study level</FieldLabel>
                <select className={inputCls} value={settings.level} onChange={(e) => update({ level: e.target.value })}>
                  {["Undergraduate","Master's","Doctoral / PhD","Postdoctoral","Industry R&D"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel>Output type</FieldLabel>
                <select className={inputCls} value={settings.outputType} onChange={(e) => update({ outputType: e.target.value })}>
                  {["Journal Article","Conference Paper","Literature Review","Research Proposal","Technical Report","Thesis Chapter","Grant Application"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </Section>

          {/* ── 3. Keywords & Sub-topics ── */}
          <Section icon={<Tag size={16} className="text-purple-500" />} title="Keywords & sub-topics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TagInput
                label="Keywords"
                tags={settings.keywords}
                inputValue={keywordInput}
                onInputChange={setKeywordInput}
                onAdd={addKeyword}
                onRemove={removeKeyword}
                placeholder="Add keyword..."
              />
              <TagInput
                label="Sub-topics / angles"
                tags={settings.subTopics}
                inputValue={subtopicInput}
                onInputChange={setSubtopicInput}
                onAdd={addSubtopic}
                onRemove={removeSubtopic}
                placeholder="Add sub-topic..."
              />
            </div>
          </Section>

          {/* ── 4. Sections ── */}
          <Section icon={<LayoutList size={16} className="text-purple-500" />} title="Content sections to generate">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(SECTION_LABELS).map(([key, label]) => (
                <CheckItem
                  key={key}
                  label={label}
                  checked={settings.sections[key]}
                  onChange={() => toggleSection(key)}
                />
              ))}
            </div>
          </Section>

          {/* ── 5. References ── */}
          <Section icon={<Book size={16} className="text-purple-500" />} title="Reference parameters">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div>
                <FieldLabel>Citation style</FieldLabel>
                <select className={inputCls} value={settings.citationStyle} onChange={(e) => update({ citationStyle: e.target.value })}>
                  {["APA 7th","IEEE","Harvard","MLA","Chicago","Vancouver"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel>Year range</FieldLabel>
                <select className={inputCls} value={settings.yearRange} onChange={(e) => update({ yearRange: e.target.value })}>
                  {["Last 3 years","Last 5 years","Last 10 years","No limit"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel>Minimum references</FieldLabel>
                <input
                  type="number"
                  className={inputCls}
                  value={settings.minReferences}
                  min={1}
                  placeholder="e.g. 20"
                  onChange={(e) => update({ minReferences: e.target.value ? Number(e.target.value) : "" })}
                />
              </div>
            </div>
            <FieldLabel>Accepted sources</FieldLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {Object.entries(SOURCE_LABELS).map(([key, label]) => (
                <CheckItem
                  key={key}
                  label={label}
                  checked={settings.acceptedSources[key]}
                  onChange={() => toggleSource(key)}
                />
              ))}
            </div>
          </Section>

          {/* ── 6. Language & Format ── */}
          <Section icon={<FileText size={16} className="text-purple-500" />} title="Language & output format">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FieldLabel>Language</FieldLabel>
                <select className={inputCls} value={settings.language} onChange={(e) => update({ language: e.target.value })}>
                  {["English","Indonesian","Malay","Spanish","French","German","Arabic","Other"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel>Writing style</FieldLabel>
                <select className={inputCls} value={settings.writingStyle} onChange={(e) => update({ writingStyle: e.target.value })}>
                  {["Academic formal","Technical","Narrative","Argumentative","Descriptive"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel>Detail level</FieldLabel>
                <select className={inputCls} value={settings.detailLevel} onChange={(e) => update({ detailLevel: e.target.value })}>
                  {["Concise (overview)","Standard","Detailed","Comprehensive"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </Section>

          {/* ── Generate Button ── */}
          <div className="flex justify-center pb-10 pt-4">
            <button
              onClick={handleGenerate}
              className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-bold py-3.5 px-12 rounded-full shadow-lg shadow-purple-900/20 transition-all active:scale-95 group"
            >
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
              Generate Research Prompt Payload
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Input class constant ─────────────────────────────────────────────────────

const inputCls =
  "w-full bg-[#11131a] border border-[#2a2d3e] text-gray-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-600";

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="bg-[#161923]/60 border border-white/5 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/5">
        {icon}
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1.5 ml-0.5">{children}</label>;
}

function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div className="relative flex items-center justify-center shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer appearance-none w-4 h-4 bg-[#11131a] border border-[#2a2d3e] rounded checked:bg-purple-600 checked:border-purple-600 transition-colors cursor-pointer"
        />
        <svg
          className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{label}</span>
    </label>
  );
}

function TagInput({
  label, tags, inputValue, onInputChange, onAdd, onRemove, placeholder,
}: {
  label: string;
  tags: string[];
  inputValue: string;
  onInputChange: (v: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
  placeholder: string;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map((tag, i) => (
            <span key={i} className="inline-flex items-center gap-1 bg-[#1a1d27] border border-[#2a2d3e] rounded-full px-2.5 py-0.5 text-xs text-gray-400">
              {tag}
              <button onClick={() => onRemove(i)} className="text-gray-500 hover:text-white ml-0.5 leading-none">&times;</button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          className={inputCls}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
          placeholder={placeholder}
        />
        <button
          onClick={onAdd}
          className="shrink-0 bg-[#1a1d27] border border-[#2a2d3e] hover:border-purple-500 text-gray-400 hover:text-white text-xs rounded-lg px-3 transition-colors"
        >
          + Add
        </button>
      </div>
    </div>
  );
}
