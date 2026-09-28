"use client";

import React, { useState } from "react";
import { 
  Globe, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  Code2, 
  Palette,
  ExternalLink,
  Flame,
  CheckCircle2,
  Workflow
} from "lucide-react";
import { PRESET_SITES, PresetSite } from "@/lib/presets";

interface LandingHeroProps {
  onStartClone: (url: string) => void;
  onSelectPreset: (preset: PresetSite) => void;
  isLoading: boolean;
}

export default function LandingHero({
  onStartClone,
  onSelectPreset,
  isLoading,
}: LandingHeroProps) {
  const [urlInput, setUrlInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onStartClone(urlInput.trim());
    }
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) setUrlInput(text);
      }
    } catch {
      // clipboard permission denied
    }
  };

  return (
    <div className="relative pt-12 pb-20 px-4 sm:px-6 max-w-6xl mx-auto overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Main Title & Value Proposition */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-300 text-xs font-semibold mb-6 backdrop-blur-md shadow-lg shadow-indigo-500/10">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Founding AI Engineer Agent Architecture</span>
          <span className="w-1 h-1 rounded-full bg-indigo-400" />
          <span>Next.js 16 • Tailwind • Sandpack</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.12]">
          Recreate any frontend with an{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            Autonomous AI Agent
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
          Enter any public URL. The agent launches a headless browser, captures pixel layout & semantic DOM, and synthesizes a production-ready responsive React + Tailwind component with live preview and self-healing.
        </p>
      </div>

      {/* Glowing URL Input Card */}
      <div className="max-w-2xl mx-auto mb-14">
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 group-hover:opacity-60 blur-lg transition duration-500" />
          
          <div className="relative flex items-center rounded-2xl bg-[#0f1118] border border-white/15 p-2 shadow-2xl">
            <div className="pl-3.5 pr-2 text-slate-400 flex items-center">
              <Globe className="w-5 h-5 text-indigo-400" />
            </div>

            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter public website URL (e.g. https://linear.app)"
              disabled={isLoading}
              className="w-full bg-transparent px-2 py-3 text-sm text-white placeholder-slate-500 focus:outline-none disabled:opacity-50 font-medium"
            />

            <button
              type="button"
              onClick={handlePaste}
              className="hidden sm:inline-flex px-2.5 py-1.5 text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors mr-2"
            >
              Paste
            </button>

            <button
              type="submit"
              disabled={isLoading || !urlInput.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all shrink-0"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Cloning...</span>
                </>
              ) : (
                <>
                  <span>Clone Frontend</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick popular target pills */}
        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-500 text-[11px]">Quick test:</span>
          {["https://linear.app", "https://stripe.com", "https://supabase.com", "https://vercel.com", "https://resend.com"].map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUrlInput(u)}
              className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-indigo-300 border border-white/5 transition-colors"
            >
              {u.replace("https://", "")}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Evaluation Benchmarks */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Evaluation Benchmark Presets (3 Distinct Archetypes)
            </h2>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">1-Click Instant Test</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRESET_SITES.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className="group text-left p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-indigo-500/40 transition-all shadow-lg hover:shadow-indigo-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    {preset.category}
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>Test Clone</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                  {preset.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {preset.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>{preset.url}</span>
                <span className="text-indigo-400/80 font-sans font-medium">{preset.badge}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Architecture Highlights Pill Strip */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.015] p-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-6">
          End-to-End Autonomous Pipeline
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <Globe className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-slate-200">1. Headless Scrape</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Playwright Chromium</div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-2">
              <Palette className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-slate-200">2. Token Extraction</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Colors, Fonts, DOM</div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-slate-200">3. Multimodal AI</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Gemini 2.5 Flash</div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-slate-200">4. Resilient Fallback</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Groq LLaMA 3.3 70B</div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-2">
              <Code2 className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-slate-200">5. Sandpack Preview</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Live React + Tailwind</div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center mx-auto mb-2">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-slate-200">6. Error Healing</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Self-healing Sandpack</div>
          </div>
        </div>
      </div>
    </div>
  );
}
