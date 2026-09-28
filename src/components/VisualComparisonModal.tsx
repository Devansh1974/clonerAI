"use client";

import React from "react";
import { X, ExternalLink, Columns, Eye } from "lucide-react";

interface VisualComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  screenshotUrl: string;
  websiteUrl: string;
  pageTitle: string;
}

export default function VisualComparisonModal({
  isOpen,
  onClose,
  screenshotUrl,
  websiteUrl,
  pageTitle,
}: VisualComparisonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[85vh] rounded-2xl border border-white/10 bg-[#0d0e14] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 bg-[#12131b] flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span>Original Target Website Screenshot</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                Full-Page Playwright Snapshot
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{pageTitle} — {websiteUrl}</p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"
            >
              <span>Visit Target URL</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Screenshot Viewport */}
        <div className="flex-1 overflow-y-auto p-6 bg-black/60 flex justify-center">
          <img
            src={screenshotUrl}
            alt={pageTitle}
            className="max-w-4xl w-full h-auto rounded-xl border border-white/10 shadow-2xl object-contain object-top"
          />
        </div>
      </div>
    </div>
  );
}
