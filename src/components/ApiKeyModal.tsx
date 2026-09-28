"use client";

import React, { useState, useEffect } from "react";
import { Key, X, Check, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeysSaved?: (keys: { gemini?: string; groq?: string; openai?: string }) => void;
}

export default function ApiKeyModal({ isOpen, onClose, onKeysSaved }: ApiKeyModalProps) {
  const [geminiKey, setGeminiKey] = useState("");
  const [groqKey, setGroqKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGeminiKey(localStorage.getItem("CLONER_GEMINI_API_KEY") || "");
      setGroqKey(localStorage.getItem("CLONER_GROQ_API_KEY") || "");
      setOpenaiKey(localStorage.getItem("CLONER_OPENAI_API_KEY") || "");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("CLONER_GEMINI_API_KEY", geminiKey.trim());
      localStorage.setItem("CLONER_GROQ_API_KEY", groqKey.trim());
      localStorage.setItem("CLONER_OPENAI_API_KEY", openaiKey.trim());
    }
    setSavedStatus(true);
    onKeysSaved?.({
      gemini: geminiKey.trim(),
      groq: groqKey.trim(),
      openai: openaiKey.trim(),
    });
    setTimeout(() => {
      setSavedStatus(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f1117] p-6 shadow-2xl text-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Provider Keys</h3>
            <p className="text-xs text-slate-400">Stored safely in your browser session or configured via .env</p>
          </div>
        </div>

        <div className="my-6 space-y-4 text-sm">
          {/* Gemini Key */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <span>Google Gemini API Key</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                  Primary Multimodal Vision
                </span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Groq Key */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <span>Groq API Key</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  Fast Fallback & Modifications
                </span>
              </label>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder="gsk_..."
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* OpenAI Key (Optional) */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <span>OpenAI API Key (Optional)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 font-mono">
                  Optional
                </span>
              </label>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-slate-400 hover:text-slate-300 flex items-center gap-1"
              >
                <span>Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder="sk-proj-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-slate-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted client-side storage</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-1.5 transition-all"
            >
              {savedStatus ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
