"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Settings, 
  RotateCcw, 
  ChevronDown, 
  Layers, 
  CheckCircle2, 
  Code2, 
  Cpu, 
  Eye, 
  Compass,
  Zap
} from "lucide-react";
import { PRESET_SITES, PresetSite } from "@/lib/presets";

interface NavbarProps {
  onSelectPreset: (preset: PresetSite) => void;
  onReset: () => void;
  onOpenSettings: () => void;
  hasActiveClone: boolean;
  activePresetId?: string;
}

export default function Navbar({
  onSelectPreset,
  onReset,
  onOpenSettings,
  hasActiveClone,
  activePresetId,
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasKeys, setHasKeys] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const g = localStorage.getItem("CLONER_GEMINI_API_KEY");
      const q = localStorage.getItem("CLONER_GROQ_API_KEY");
      setHasKeys(Boolean(g || q));
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#08090d]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1px] shadow-lg shadow-indigo-500/25">
              <div className="w-full h-full bg-[#0d0e14] rounded-xl flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white">Cloner.AI</span>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30">
                  Agent v2.5
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* System Architecture Status Badges (Hidden on mobile) */}
        <div className="hidden xl:flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">Playwright Chromium</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span className="text-slate-300">Gemini 2.5 Flash + Groq</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-slate-300">Sandpack Engine</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Preset Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-xs font-medium text-slate-200 flex items-center gap-2 transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>Benchmark Presets</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/10 bg-[#0f1118] p-2 shadow-2xl z-40 text-xs animate-in fade-in duration-150">
                  <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 border-b border-white/5 uppercase tracking-wider">
                    Official Evaluation Sites
                  </div>
                  {PRESET_SITES.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onSelectPreset(preset);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl flex items-start gap-3 hover:bg-white/5 transition-colors ${
                        activePresetId === preset.id ? "bg-indigo-500/10 border border-indigo-500/20" : ""
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-200">{preset.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-slate-400 font-mono">
                            {preset.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{preset.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Reset / New Clone Button */}
          {hasActiveClone && (
            <button
              onClick={onReset}
              className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
              title="Start a new cloning session"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Clone</span>
            </button>
          )}

          {/* Settings / API Keys Modal Button */}
          <button
            onClick={onOpenSettings}
            className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-xs font-medium text-slate-200 flex items-center gap-2 transition-all relative"
            title="Configure Gemini & Groq API Keys"
          >
            <Settings className="w-3.5 h-3.5 text-slate-300" />
            <span>Settings</span>
            <span
              className={`w-2 h-2 rounded-full ${
                hasKeys ? "bg-emerald-400 shadow-sm shadow-emerald-400/50" : "bg-amber-400"
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
