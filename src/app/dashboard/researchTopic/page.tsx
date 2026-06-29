"use client";

import { useState } from "react";
import {
  Lightbulb,
  GraduationCap,
  FlaskConical,
  Globe,
  Layers,
  Sparkles,
  ChevronDown,
  X,
  TrendingUp,
  Zap,
  RotateCcw,
  Copy,
  Check,
  FileText,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormState {
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

const DEFAULT_FORM: FormState = {
  broadField: "",
  customField: "",
  discipline: "Any",
  studyLevel: "Master's",
  interest: "",
  topicCount: 5,
  trendFocus: "Any",
  methodology: "Any",
  region: "Global",
  avoidTopics: "",
};

// ─── Option Lists ─────────────────────────────────────────────────────────────

const BROAD_FIELDS = [
  "Artificial Intelligence & Machine Learning",
  "Biomedical & Health Sciences",
  "Environmental & Climate Science",
  "Social Sciences & Psychology",
  "Economics & Business",
  "Education & Learning",
  "Cybersecurity & Privacy",
  "Renewable Energy & Sustainability",
  "Materials Science & Nanotechnology",
  "Communication & Media Studies",
  "Law & Policy",
  "Agriculture & Food Science",
  "Other / Custom",
];

const DISCIPLINES = [
  "Any",
  "Computer Science",
  "Engineering",
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Medicine",
  "Nursing",
  "Pharmacy",
  "Psychology",
  "Sociology",
  "Economics",
  "Management",
  "Public Administration",
  "Law",
  "Education",
  "Communication",
  "Architecture",
  "Environmental Science",
  "Agriculture",
];

const STUDY_LEVELS = [
  "Undergraduate",
  "Master's",
  "Doctoral / PhD",
  "Postdoctoral",
  "Industry R&D",
];

const TREND_FOCUS = [
  "Any",
  "Cutting-edge / Emerging",
  "Well-established with gaps",
  "Interdisciplinary",
  "Policy-relevant",
  "Technology-driven",
];

const METHODOLOGIES = [
  "Any",
  "Quantitative",
  "Qualitative",
  "Mixed Methods",
  "Experimental",
  "Computational / Simulation",
  "Systematic Review",
  "Case Study",
];

const REGIONS = [
  "Global",
  "Southeast Asia",
  "East Asia",
  "South Asia",
  "Europe",
  "North America",
  "Latin America",
  "Middle East",
  "Africa",
  "Australia & Pacific",
];

// ─── Prompt Builder ───────────────────────────────────────────────────────────

function buildPrompt(form: FormState, finalField: string): string {
  const lines: string[] = [];

  lines.push(
    `You are an expert academic research advisor. Generate exactly ${form.topicCount} specific, novel, and well-defined research topic suggestions based on the following parameters.`
  );
  lines.push("");
  lines.push("=== RESEARCH PARAMETERS ===");
  lines.push(`Research Field   : ${finalField}`);

  if (form.discipline !== "Any") {
    lines.push(`Discipline       : ${form.discipline}`);
  }

  lines.push(`Study Level      : ${form.studyLevel}`);

  if (form.interest.trim()) {
    lines.push(`Specific Interest: ${form.interest.trim()}`);
  }

  if (form.trendFocus !== "Any") {
    lines.push(`Topic Focus      : ${form.trendFocus}`);
  }

  if (form.methodology !== "Any") {
    lines.push(`Methodology      : ${form.methodology}`);
  }

  if (form.region !== "Global") {
    lines.push(`Regional Context : ${form.region}`);
  }

  if (form.avoidTopics.trim()) {
    lines.push(`Topics to AVOID  : ${form.avoidTopics.trim()}`);
  }

  lines.push("");
  lines.push("=== OUTPUT FORMAT ===");
  lines.push(
    `For each of the ${form.topicCount} topics, provide the following structure:`
  );
  lines.push("");
  lines.push("**[Number]. Topic Title**");
  lines.push("- Tagline: One compelling sentence summarizing the topic.");
  lines.push(
    "- Description: 2–3 sentences describing what this research explores, investigates, or contributes."
  );
  lines.push(
    "- Why It Matters: 1–2 sentences on why this topic is important or timely."
  );
  lines.push(
    "- Keywords: 4–5 relevant academic keywords (comma-separated)."
  );
  lines.push(
    "- Novelty: [High / Medium / Emerging]"
  );
  lines.push(
    "- Difficulty: [Accessible / Moderate / Advanced]"
  );
  lines.push("");
  lines.push("=== RULES ===");
  lines.push(
    "- Each topic must be SPECIFIC and ACTIONABLE, not vague or generic."
  );
  lines.push(
    `- Topics must be realistic and appropriate for ${form.studyLevel} level.`
  );
  lines.push("- Vary the novelty and difficulty across suggestions.");
  lines.push("- Do NOT repeat similar or overlapping topics.");
  lines.push("- Use real, recognized academic/research keywords.");
  lines.push(
    `- Generate exactly ${form.topicCount} topics — no more, no less.`
  );

  return lines.join("\n");
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ResearchTopicGenerator() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const update = (patch: Partial<FormState>) =>
    setForm((f) => ({ ...f, ...patch }));

  const isCustomField = form.broadField === "Other / Custom";
  const finalField = isCustomField ? form.customField : form.broadField;
  const canGenerate = finalField.trim().length > 0;

  const handleGenerate = () => {
    if (!canGenerate) return;
    const prompt = buildPrompt(form, finalField);
    setGeneratedPrompt(prompt);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const reset = () => {
    setForm(DEFAULT_FORM);
    setGeneratedPrompt("");
    setCopied(false);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen bg-[#080a10] text-white"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-5 py-10 md:py-14">

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 text-xs font-medium text-violet-400 mb-4">
            <Sparkles size={11} />
            Prompt Builder for ChatGPT / AI
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Research Topic{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
              Prompt Generator
            </span>
          </h1>
          <p className="text-gray-400 text-base max-w-xl leading-relaxed">
            Configure your research parameters, generate a ready-to-use prompt,
            then paste it into ChatGPT or any AI to get tailored topic
            suggestions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

          {/* ── LEFT: Prompt Output ── */}
          <div className="order-2 lg:order-1">

            {/* Empty state */}
            {!generatedPrompt && (
              <div className="rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center min-h-[480px] p-12">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                  <FileText size={28} className="text-gray-600" />
                </div>
                <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                  Fill in the parameters on the right, then click{" "}
                  <span className="text-white font-medium">
                    Generate Prompt
                  </span>{" "}
                  to build your ChatGPT-ready prompt.
                </p>
              </div>
            )}

            {/* Generated prompt */}
            {generatedPrompt && (
              <div className="rounded-2xl border border-violet-500/20 bg-[#0d0f16] overflow-hidden">

                {/* Prompt header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-[#0a0c13]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-violet-500" />
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Generated Prompt
                    </p>
                    <span className="text-[10px] bg-violet-500/15 border border-violet-500/25 text-violet-400 rounded-full px-2 py-0.5 font-medium">
                      Ready for ChatGPT
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all
                      ${copied
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                      }`}
                  >
                    {copied ? (
                      <Check size={12} />
                    ) : (
                      <Copy size={12} />
                    )}
                    {copied ? "Copied!" : "Copy Prompt"}
                  </button>
                </div>

                {/* Prompt body */}
                <pre className="p-5 text-[13px] text-gray-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[600px] overflow-y-auto">
                  {generatedPrompt}
                </pre>

                {/* Prompt footer */}
                <div className="px-5 py-3.5 border-t border-white/5 bg-[#0a0c13] flex items-center justify-between">
                  <p className="text-[11px] text-gray-600">
                    Copy this prompt → paste into ChatGPT, Gemini, or any AI
                  </p>
                  <button
                    onClick={handleGenerate}
                    className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-white transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5"
                  >
                    <RotateCcw size={11} />
                    Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Config Panel ── */}
          <div className="order-1 lg:order-2 sticky top-6">
            <div className="rounded-2xl border border-white/10 bg-[#0d0f16] p-5 space-y-5">

              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Parameters
                </p>
                <button
                  onClick={reset}
                  className="flex items-center gap-1 text-[11px] text-gray-600 hover:text-gray-400 transition-colors"
                >
                  <RotateCcw size={10} /> Reset
                </button>
              </div>

              {/* Research field */}
              <Field icon={<Globe size={13} />} label="Research field *">
                <Select
                  value={form.broadField}
                  onChange={(v) => update({ broadField: v, customField: "" })}
                  options={BROAD_FIELDS}
                  placeholder="Select a field…"
                />
                {isCustomField && (
                  <input
                    className={inputCls + " mt-2"}
                    value={form.customField}
                    onChange={(e) => update({ customField: e.target.value })}
                    placeholder="e.g. Urban Mobility & Smart Cities"
                    autoFocus
                  />
                )}
              </Field>

              {/* Specific interest */}
              <Field
                icon={<Lightbulb size={13} />}
                label="Specific interest or angle (optional)"
              >
                <textarea
                  className={inputCls + " min-h-[64px] resize-none"}
                  value={form.interest}
                  onChange={(e) => update({ interest: e.target.value })}
                  placeholder="e.g. focus on low-resource languages in Southeast Asia…"
                />
              </Field>

              {/* Discipline */}
              <Field icon={<GraduationCap size={13} />} label="Discipline">
                <Select
                  value={form.discipline}
                  onChange={(v) => update({ discipline: v })}
                  options={DISCIPLINES}
                />
              </Field>

              {/* Study level */}
              <Field icon={<Layers size={13} />} label="Study level">
                <Select
                  value={form.studyLevel}
                  onChange={(v) => update({ studyLevel: v })}
                  options={STUDY_LEVELS}
                />
              </Field>

              {/* Number of topics */}
              <Field
                icon={<TrendingUp size={13} />}
                label={`Number of topics: ${form.topicCount}`}
              >
                <input
                  type="range"
                  min={3}
                  max={10}
                  step={1}
                  value={form.topicCount}
                  onChange={(e) =>
                    update({ topicCount: Number(e.target.value) })
                  }
                  className="w-full accent-violet-500"
                />
                <div className="flex justify-between text-[10px] text-gray-600 mt-0.5">
                  <span>3</span>
                  <span>10</span>
                </div>
              </Field>

              {/* Topic focus */}
              <Field icon={<Zap size={13} />} label="Topic focus">
                <Select
                  value={form.trendFocus}
                  onChange={(v) => update({ trendFocus: v })}
                  options={TREND_FOCUS}
                />
              </Field>

              {/* Methodology */}
              <Field
                icon={<FlaskConical size={13} />}
                label="Preferred methodology"
              >
                <Select
                  value={form.methodology}
                  onChange={(v) => update({ methodology: v })}
                  options={METHODOLOGIES}
                />
              </Field>

              {/* Region */}
              <Field icon={<Globe size={13} />} label="Regional context">
                <Select
                  value={form.region}
                  onChange={(v) => update({ region: v })}
                  options={REGIONS}
                />
              </Field>

              {/* Avoid topics */}
              <Field
                icon={<X size={13} />}
                label="Topics to avoid (optional)"
              >
                <input
                  className={inputCls}
                  value={form.avoidTopics}
                  onChange={(e) => update({ avoidTopics: e.target.value })}
                  placeholder="e.g. ChatGPT, COVID-19, blockchain…"
                />
              </Field>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm transition-all
                  ${canGenerate
                    ? "bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white shadow-lg shadow-violet-900/20 active:scale-[.99]"
                    : "bg-white/5 text-gray-600 cursor-not-allowed border border-white/5"
                  }`}
              >
                <Sparkles size={16} />
                Generate Prompt
              </button>

              {!canGenerate && (
                <p className="text-center text-[11px] text-gray-600 -mt-2">
                  Select a research field to continue
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Shared Styles ────────────────────────────────────────────────────────────

const inputCls =
  "w-full bg-[#080a10] border border-white/10 text-gray-200 text-[13px] rounded-xl px-3 py-2 focus:outline-none focus:border-violet-500/50 transition-colors placeholder:text-gray-700";

// ─── Field Wrapper ────────────────────────────────────────────────────────────

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        <span className="text-gray-600">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Select Wrapper ───────────────────────────────────────────────────────────

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} appearance-none pr-8 cursor-pointer`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
      />
    </div>
  );
}
