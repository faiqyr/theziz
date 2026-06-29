// src/components/ThesisProfileManager.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useThesisStore } from "@/store/useThesisStore";
import { Save, Edit2, BookOpen, CheckCircle, Plus, X, AlertTriangle, ChevronDown, Trash2 } from "lucide-react"; 

const PREDEFINED_DEPTS = [
  "Informatika", 
  "Sistem Informasi", 
  "Teknik Komputer", 
  "Ilmu Komunikasi", 
  "Manajemen", 
  "Akuntansi"
];

const PREDEFINED_DEGREES = [
  "D1 (Diploma 1)", 
  "D2 (Diploma 2)", 
  "D3 (Diploma 3)", 
  "D4 (Sarjana Terapan)", 
  "S1 (Sarjana)", 
  "S2 (Magister)", 
  "S3 (Doktor)"
];

export default function ThesisProfileManager() {
  const router = useRouter();
  const { theses, updateThesis, addThesis, deleteThesis } = useThesisStore();
  
  const [selectedTab, setSelectedTab] = useState(theses[0]?.id || "thesis-1");
  const [isSaved, setIsSaved] = useState(false);
  const [thesisToDelete, setThesisToDelete] = useState<string | null>(null);

  const [forceCustomDept, setForceCustomDept] = useState(false);
  const [forceCustomDegree, setForceCustomDegree] = useState(false);

  const activeData = theses.find((t) => t.id === selectedTab) || theses[0];

  useEffect(() => {
    if (!theses.find(t => t.id === selectedTab) && theses.length > 0) {
      setSelectedTab(theses[0].id);
    }
  }, [theses, selectedTab]);

  useEffect(() => {
    setForceCustomDept(false);
    setForceCustomDegree(false);
  }, [selectedTab]);

  // Handle standard string fields
  const handleChange = (field: string, value: string) => {
    if (activeData) {
      updateThesis(activeData.id, { [field]: value });
    }
  };

  // Handle dynamic array fields (RP, RQ, RO)
  const handleArrayChange = (field: "rp" | "rq" | "ro", newArray: string[]) => {
    if (activeData) {
      updateThesis(activeData.id, { [field]: newArray });
    }
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      router.back(); 
    }, 1500);
  };

  const confirmDelete = () => {
    if (thesisToDelete) {
      deleteThesis(thesisToDelete);
      setThesisToDelete(null); 
    }
  };

  if (!activeData) return null;

  const currentDept = activeData.department || "";
  const isCustomDept = forceCustomDept || (currentDept !== "" && !PREDEFINED_DEPTS.includes(currentDept));
  let deptSelectValue = currentDept;
  if (isCustomDept) deptSelectValue = "Lainnya";
  if (!currentDept && !forceCustomDept) deptSelectValue = "";

  const currentDegree = activeData.degreeLevel || "";
  const isCustomDegree = forceCustomDegree || (currentDegree !== "" && !PREDEFINED_DEGREES.includes(currentDegree));
  let degreeSelectValue = currentDegree;
  if (isCustomDegree) degreeSelectValue = "Lainnya";
  if (!currentDegree && !forceCustomDegree) degreeSelectValue = "";

  return (
    <div className="bg-[#11131a] rounded-xl border border-[#2a2d3e] p-6 text-white max-w-4xl relative overflow-hidden">
      
      {/* OVERLAY KONFIRMASI HAPUS */}
      {thesisToDelete && (
        <div className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#1a1d27] border border-red-500/30 rounded-xl p-6 max-w-md w-full shadow-2xl shadow-red-900/20 transform scale-100 animate-in zoom-in-95">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-500/20 p-3 rounded-full text-red-500">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Workspace?</h3>
                <p className="text-sm text-gray-400">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-6 border-t border-white/10 pt-4">
              Are you sure you want to permanently delete the 
              <span className="font-bold text-white mx-1">
                {theses.find(t => t.id === thesisToDelete)?.customName}
              </span> 
              context data?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setThesisToDelete(null)} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-500 rounded-md transition-colors shadow-lg shadow-red-900/50">
                Yes, Delete It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS OVERLAY */}
      {isSaved && (
        <div className="absolute inset-0 bg-[#11131a]/90 backdrop-blur-sm z-40 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <CheckCircle size={48} className="text-green-500 mb-4 animate-bounce" />
          <h3 className="text-2xl font-bold text-white">Context Saved!</h3>
          <p className="text-gray-400 mt-2">Redirecting to your workspace...</p>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <BookOpen className="text-purple-500" />
        <h2 className="text-xl font-bold">Research Context Data</h2>
      </div>

      {/* DYNAMIC TABS SYSTEM */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {theses.map((thesis) => (
          <div
            key={thesis.id}
            onClick={() => setSelectedTab(thesis.id)}
            className={`group relative flex items-center px-4 py-2 rounded-t-lg font-medium text-sm transition-all border-b-2 cursor-pointer whitespace-nowrap ${
              selectedTab === thesis.id
                ? "border-purple-500 text-white bg-white/5"
                : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5"
            }`}
          >
            {thesis.customName}
            {thesis.id !== "thesis-1" && (
              <button 
                onClick={(e) => { e.stopPropagation(); setThesisToDelete(thesis.id); }}
                className="ml-3 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-[#11131a]/50 rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
        {theses.length < 5 && (
          <button 
            onClick={() => {
              addThesis();
              setTimeout(() => {
                const updatedStore = useThesisStore.getState();
                const latestThesis = updatedStore.theses[updatedStore.theses.length - 1];
                setSelectedTab(latestThesis.id);
              }, 50);
            }}
            className="px-3 py-2 text-gray-500 hover:text-purple-400 hover:bg-white/5 rounded-t-lg transition-colors border-b-2 border-transparent flex items-center shrink-0"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      {/* FORM FIELDS */}
      <div className="space-y-6">
        
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Workspace Name</label>
          <div className="relative">
            <input
              type="text"
              value={activeData.customName || ""}
              onChange={(e) => handleChange("customName", e.target.value)}
              className="w-full bg-[#161923] border border-[#2a2d3e] rounded-md p-3 text-sm focus:border-purple-500 focus:outline-none"
            />
            <Edit2 size={14} className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Proposed Title</label>
          <textarea
            value={activeData.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full bg-[#161923] border border-[#2a2d3e] rounded-md p-3 text-sm h-20 focus:border-purple-500 focus:outline-none"
          />
        </div>

        <div className="space-y-4 bg-white/5 p-5 rounded-lg border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Program Studi (Department)</label>
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <select
                    value={deptSelectValue}
                    onChange={(e) => {
                      if (e.target.value === "Lainnya") {
                        setForceCustomDept(true);
                        handleChange("department", "");
                      } else {
                        setForceCustomDept(false);
                        handleChange("department", e.target.value);
                      }
                    }}
                    className="w-full bg-[#161923] border border-[#2a2d3e] rounded-md p-3 text-sm focus:border-purple-500 focus:outline-none appearance-none cursor-pointer text-gray-200"
                  >
                    <option value="" disabled>Select Department...</option>
                    {PREDEFINED_DEPTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    <option value="Lainnya">Lainnya (Ketik Manual)...</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" />
                </div>
                {isCustomDept && (
                  <input
                    type="text"
                    value={currentDept}
                    onChange={(e) => handleChange("department", e.target.value)}
                    className="w-full bg-[#161923] border border-purple-500/50 rounded-md p-3 text-sm focus:border-purple-500 focus:outline-none animate-in fade-in slide-in-from-top-1"
                    autoFocus
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Jenjang Pendidikan (Degree Level)</label>
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <select
                    value={degreeSelectValue}
                    onChange={(e) => {
                      if (e.target.value === "Lainnya") {
                        setForceCustomDegree(true);
                        handleChange("degreeLevel", "");
                      } else {
                        setForceCustomDegree(false);
                        handleChange("degreeLevel", e.target.value);
                      }
                    }}
                    className="w-full bg-[#161923] border border-[#2a2d3e] rounded-md p-3 text-sm focus:border-purple-500 focus:outline-none appearance-none cursor-pointer text-gray-200"
                  >
                    <option value="" disabled>Select Degree...</option>
                    {PREDEFINED_DEGREES.map(deg => <option key={deg} value={deg}>{deg}</option>)}
                    <option value="Lainnya">Lainnya (Ketik Manual)...</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" />
                </div>
                {isCustomDegree && (
                  <input
                    type="text"
                    value={currentDegree}
                    onChange={(e) => handleChange("degreeLevel", e.target.value)}
                    className="w-full bg-[#161923] border border-purple-500/50 rounded-md p-3 text-sm focus:border-purple-500 focus:outline-none animate-in fade-in slide-in-from-top-1"
                    autoFocus
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Main Problem</label>
          <textarea
            value={activeData.mainProblem || ""}
            onChange={(e) => handleChange("mainProblem", e.target.value)}
            className="w-full bg-[#161923] border border-[#2a2d3e] rounded-md p-3 text-sm h-32 focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* --- DYNAMIC CRUD GRIDS (RP, RQ, RO) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
          <DynamicList 
            label="Research Problems" prefix="RP"
            items={activeData.rp || [""]} 
            onChange={(newArr) => handleArrayChange("rp", newArr)} 
            colorClass="text-purple-400"
          />
          <DynamicList 
            label="Research Questions" prefix="RQ"
            items={activeData.rq || [""]} 
            onChange={(newArr) => handleArrayChange("rq", newArr)} 
            colorClass="text-blue-400"
          />
          <DynamicList 
            label="Research Objectives" prefix="RO"
            items={activeData.ro || [""]} 
            onChange={(newArr) => handleArrayChange("ro", newArr)} 
            colorClass="text-green-400"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={handleSave} className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-2.5 rounded-md text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-purple-900/30">
            <Save size={16} /> Save Context
          </button>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENT: Dynamic List (CRUD) ---
function DynamicList({ 
  label, prefix, items, onChange, colorClass 
}: { 
  label: string, prefix: string, items: string[], onChange: (items: string[]) => void, colorClass: string 
}) {
  
  const handleUpdate = (index: number, val: string) => {
    const newItems = [...items];
    newItems[index] = val;
    onChange(newItems);
  };

  const handleAdd = () => {
    if (items.length < 5) {
      onChange([...items, ""]);
    }
  };

  const handleDelete = (index: number) => {
    // Keep at least one empty box
    if (items.length === 1) {
      onChange([""]);
      return;
    }
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className={`block text-xs font-bold uppercase ${colorClass}`}>{label} ({prefix})</label>
        <span className="text-[10px] text-gray-500 font-medium">{items.length}/5</span>
      </div>
      
      {items.map((item, index) => (
        <div key={index} className="relative group animate-in fade-in slide-in-from-top-2">
          <div className="absolute left-3 top-3 text-[10px] font-bold text-gray-500 uppercase">
            {prefix}{index + 1}
          </div>
          <textarea 
            value={item}
            onChange={(e) => handleUpdate(index, e.target.value)}
            className="w-full bg-[#161923] border border-[#2a2d3e] rounded-md pl-12 pr-10 py-3 text-sm h-20 focus:border-purple-500 focus:outline-none transition-colors"
          />
          <button
            onClick={() => handleDelete(index)}
            className="absolute right-2 top-2 p-1.5 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-md transition-all opacity-0 group-hover:opacity-100"
            title="Delete Item"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      {items.length < 5 && (
        <button 
          onClick={handleAdd}
          className="w-full py-2 border border-dashed border-[#2a2d3e] rounded-md text-xs text-gray-400 hover:text-purple-400 hover:border-purple-500/50 hover:bg-white/5 transition-all flex items-center justify-center gap-1"
        >
          <Plus size={14} /> Add {prefix}
        </button>
      )}
    </div>
  );
}