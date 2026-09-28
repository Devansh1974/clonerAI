"use client";

import React, { useState } from "react";
import { 
  Terminal, 
  Palette, 
  Layers, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Copy, 
  Check, 
  Sparkles,
  Maximize2
} from "lucide-react";
import { LogStep, ScrapeResult } from "@/lib/types";
import { copyToClipboard } from "@/lib/utils";

interface TerminalLogsProps {
  steps: LogStep[];
  scrapeData?: ScrapeResult | null;
  activeProvider?: string;
  generationDuration?: number;
  onOpenScreenshotModal?: () => void;
}

export default function TerminalLogs({
  steps,
  scrapeData,
  activeProvider,
  generationDuration,
  onOpenScreenshotModal,
}: TerminalLogsProps) {
  const [activeTab, setActiveTab] = useState<"terminal" | "tokens" | "screenshot">("terminal");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyColor = async (hex: string) => {
    const ok = await copyToClipboard(hex);
    if (ok) {
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1500);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d0e14] overflow-hidden flex flex-col h-full shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="px-4 py-3 border-b border-white/10 bg-[#12131b] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Agent Execution Log</span>
          </span>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5 text-[11px]">
          <button
            onClick={() => setActiveTab("terminal")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeTab === "terminal" ? "bg-white/10 text-white font-medium" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Steps & Console
          </button>
          <button
            onClick={() => setActiveTab("tokens")}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
              activeTab === "tokens" ? "bg-white/10 text-white font-medium" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Palette className="w-3 h-3 text-indigo-400" />
            <span>Design Tokens</span>
          </button>
          {scrapeData?.screenshotBase64 && (
            <button
              onClick={() => setActiveTab("screenshot")}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                activeTab === "screenshot" ? "bg-white/10 text-white font-medium" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ImageIcon className="w-3 h-3 text-emerald-400" />
              <span>Snapshot</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 flex-1 overflow-y-auto font-mono text-xs text-slate-300 space-y-3">
        {activeTab === "terminal" && (
          <div className="space-y-3">
            {/* Structured Step Progress Indicators */}
            <div className="space-y-2 pb-3 border-b border-white/5">
              {steps.map((step) => {
                let icon = null;
                let statusColor = "text-slate-500";
                let dot = "bg-slate-600";

                if (step.status === "running") {
                  statusColor = "text-amber-300 font-semibold";
                  dot = "bg-amber-400 animate-pulse";
                  icon = <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shrink-0" />;
                } else if (step.status === "success") {
                  statusColor = "text-emerald-400";
                  dot = "bg-emerald-400";
                  icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
                } else if (step.status === "error") {
                  statusColor = "text-rose-400 font-semibold";
                  dot = "bg-rose-400";
                  icon = <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
                } else {
                  dot = "bg-slate-600";
                  icon = <div className="w-3 h-3 rounded-full border border-slate-600 shrink-0" />;
                }

                return (
                  <div key={step.id} className="flex items-start gap-2.5">
                    <div className="mt-0.5">{icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`${statusColor} text-[11px]`}>{step.title}</span>
                        <span className="text-[10px] text-slate-500 font-sans">{step.timestamp}</span>
                      </div>
                      {step.detail && (
                        <p className="text-[10px] text-slate-400 mt-0.5 font-sans leading-tight">
                          {step.detail}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Provider and Duration Pill */}
            {activeProvider && (
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between font-sans">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs font-semibold text-indigo-200">
                    Active Model: <span className="uppercase font-mono">{activeProvider}</span>
                  </span>
                </div>
                {generationDuration && (
                  <span className="text-[11px] text-indigo-300 font-mono">
                    {(generationDuration / 1000).toFixed(1)}s latency
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Design Tokens Tab */}
        {activeTab === "tokens" && (
          <div className="space-y-4 font-sans">
            {/* Colors Swatch */}
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-400" />
                <span>Extracted Color Palette</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {scrapeData?.colors?.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => handleCopyColor(c.hex)}
                    className="p-2 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 flex items-center gap-2.5 transition-colors group text-left"
                  >
                    <div
                      className="w-6 h-6 rounded-lg border border-white/20 shrink-0 shadow-sm"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-mono font-semibold text-white flex items-center justify-between">
                        <span>{c.hex}</span>
                        {copiedHex === c.hex ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{c.usage}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Detected Font Stacks
              </div>
              <div className="space-y-1.5">
                {scrapeData?.fonts?.map((f, i) => (
                  <div key={i} className="p-2 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{f.family}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{f.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Discovered Sections */}
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Discovered Layout Hierarchy</span>
              </div>
              <div className="space-y-1.5">
                {scrapeData?.sections?.slice(0, 5).map((sec, i) => (
                  <div key={i} className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                        &lt;{sec.tag}&gt;
                      </span>
                      {sec.heading && <span className="font-semibold text-white truncate">{sec.heading}</span>}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{sec.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Screenshot Tab */}
        {activeTab === "screenshot" && scrapeData?.screenshotBase64 && (
          <div className="space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Playwright Viewport Capture</span>
              {onOpenScreenshotModal && (
                <button
                  onClick={onOpenScreenshotModal}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enlarge / Compare</span>
                </button>
              )}
            </div>
            <div className="rounded-xl overflow-hidden border border-white/10 bg-black/50 aspect-video relative group">
              <img
                src={scrapeData.screenshotBase64}
                alt="Target Website Snapshot"
                className="w-full h-full object-cover object-top"
              />
              <div
                onClick={onOpenScreenshotModal}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity backdrop-blur-xs"
              >
                <div className="px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-md flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>View Full Screenshot</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
