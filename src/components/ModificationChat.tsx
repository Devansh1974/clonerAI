"use client";

import React, { useState } from "react";
import { 
  Send, 
  Sparkles, 
  MessageSquare, 
  Wand2, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  Clock
} from "lucide-react";

interface ModificationChatProps {
  onModify: (instruction: string) => Promise<void>;
  isModifying: boolean;
  healingState: {
    isHealing: boolean;
    errorCount: number;
    lastHealedError?: string;
  };
}

export default function ModificationChat({
  onModify,
  isModifying,
  healingState,
}: ModificationChatProps) {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<{ text: string; time: string; success: boolean }[]>([]);

  const quickPrompts = [
    "Make the navbar sticky",
    "Change the primary color to blue",
    "Add a testimonials section",
    "Add pricing comparison cards",
    "Add customer logos ticker",
  ];

  const handleSubmit = async (textToSubmit?: string) => {
    const instruction = (textToSubmit || prompt).trim();
    if (!instruction || isModifying) return;

    setPrompt("");
    try {
      await onModify(instruction);
      setHistory((prev) => [
        {
          text: instruction,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          success: true,
        },
        ...prev.slice(0, 4),
      ]);
    } catch {
      setHistory((prev) => [
        {
          text: instruction,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          success: false,
        },
        ...prev.slice(0, 4),
      ]);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d0e14] overflow-hidden flex flex-col shadow-2xl">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-[#12131b] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-slate-200">Natural Language Modifications</span>
        </div>

        {/* Self-healing Status Badge */}
        {healingState.isHealing ? (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Self-Healing Runtime...</span>
          </div>
        ) : healingState.errorCount > 0 ? (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
            <CheckCircle2 className="w-3 h-3" />
            <span>Auto-Healed ({healingState.errorCount})</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Sandpack Ready</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Carousel */}
      <div className="p-3 border-b border-white/5 bg-white/[0.01]">
        <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-2">
          Quick AI Directives
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSubmit(qp)}
              disabled={isModifying}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 border border-white/5 hover:border-indigo-500/30 transition-colors disabled:opacity-50 text-left"
            >
              + {qp}
            </button>
          ))}
        </div>
      </div>

      {/* History Feed */}
      {history.length > 0 && (
        <div className="p-3 border-b border-white/5 space-y-1.5 max-h-36 overflow-y-auto">
          {history.map((item, idx) => (
            <div
              key={idx}
              className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-300 truncate font-medium">"{item.text}"</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono ml-2 shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Input box */}
      <div className="p-3 bg-[#0d0e14]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex items-center gap-2 relative"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. 'Make the navbar sticky' or 'Add modern dark cards'..."
            disabled={isModifying}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isModifying || !prompt.trim()}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-md shadow-indigo-600/25 flex items-center gap-1.5 transition-all shrink-0"
          >
            {isModifying ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{isModifying ? "Applying..." : "Modify"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
