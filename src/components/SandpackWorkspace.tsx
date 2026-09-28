"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import {
  Monitor,
  Tablet,
  Smartphone,
  Copy,
  Check,
  Download,
  Code2,
  Eye,
  Columns,
  RefreshCw,
  Sparkles,
  Maximize2,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

interface SandpackWorkspaceProps {
  code: string;
  onCodeChange: (newCode: string) => void;
  originalScreenshot?: string;
  onTriggerSelfHeal: (errorMessage: string) => Promise<void>;
  isHealing?: boolean;
}

// Inner helper component to listen to Sandpack runtime and compilation errors
function SandpackErrorWatcher({
  onCatchError,
}: {
  onCatchError: (errorMsg: string) => void;
}) {
  const { sandpack } = useSandpack();
  const lastReportedError = useRef<string | null>(null);

  useEffect(() => {
    // Check if sandpack has active compilation or runtime error
    const activeError = sandpack.error;
    if (activeError && activeError.message) {
      const msg = activeError.message;
      const isSyntaxOrRuntime =
        msg.includes("Error") ||
        msg.includes("is not defined") ||
        msg.includes("SyntaxError") ||
        msg.includes("Module not found") ||
        msg.includes("Cannot find module") ||
        msg.includes("Unexpected token") ||
        msg.includes("Parse error");

      const isNetworkNoise =
        msg.includes("Failed to fetch") ||
        msg.includes("Load failed") ||
        msg.includes("NetworkError");

      if (isSyntaxOrRuntime && !isNetworkNoise && lastReportedError.current !== msg) {
        lastReportedError.current = msg;
        console.warn("[Sandpack Runtime Error Intercepted for Healing]:", msg);
        onCatchError(msg);
      }
    }
  }, [sandpack.error, onCatchError]);

  return null;
}

export default function SandpackWorkspace({
  code,
  onCodeChange,
  originalScreenshot,
  onTriggerSelfHeal,
  isHealing = false,
}: SandpackWorkspaceProps) {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [viewMode, setViewMode] = useState<"preview" | "code" | "split" | "compare">("preview");
  const [copied, setCopied] = useState(false);
  const [comparisonSplit, setComparisonSplit] = useState(50); // percentage for visual comparison slider

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/typescript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "GeneratedWebsite.tsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Sandpack custom HTML with Tailwind CDN and Google Fonts
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cloned Component Preview</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
      body {
        margin: 0;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      /* Custom scrollbars inside preview */
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(150, 150, 150, 0.3); border-radius: 9999px; }
    </style>
  </head>
  <body class="antialiased">
    <div id="root"></div>
  </body>
</html>`;

  // Sandpack entrypoint
  const entryIndexTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}`;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d0e14] overflow-hidden flex flex-col h-full shadow-2xl">
      {/* Workspace Controls Header */}
      <div className="px-4 py-2.5 border-b border-white/10 bg-[#12131b] flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* View Mode Switches */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 text-xs">
          <button
            onClick={() => setViewMode("preview")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              viewMode === "preview" ? "bg-indigo-600 text-white font-medium shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          <button
            onClick={() => setViewMode("code")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              viewMode === "code" ? "bg-indigo-600 text-white font-medium shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>

          <button
            onClick={() => setViewMode("split")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              viewMode === "split" ? "bg-indigo-600 text-white font-medium shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split</span>
          </button>

          {originalScreenshot && (
            <button
              onClick={() => setViewMode("compare")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                viewMode === "compare" ? "bg-purple-600 text-white font-medium shadow-sm" : "text-purple-300 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Visual Compare</span>
            </button>
          )}
        </div>

        {/* Viewport Dimension Switchers (only active in preview / compare mode) */}
        {viewMode !== "code" && (
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 text-xs">
            <button
              onClick={() => setViewport("desktop")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewport === "desktop" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Desktop View (100%)"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport("tablet")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewport === "tablet" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport("mobile")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewport === "mobile" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Actions: Copy & Download */}
        <div className="flex items-center gap-2">
          {isHealing && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-mono animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Self-Healing...</span>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Code"}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 text-xs font-medium text-indigo-200 flex items-center gap-1.5 transition-colors"
            title="Download GeneratedWebsite.tsx"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export .tsx</span>
          </button>
        </div>
      </div>

      {/* Main Sandpack Container */}
      <div className="flex-1 bg-[#090a0f] relative overflow-hidden flex items-center justify-center p-2">
        <SandpackProvider
          template="react-ts"
          theme="dark"
          files={{
            "/App.tsx": {
              code: code,
              active: true,
            },
            "/public/index.html": {
              code: indexHtml,
              hidden: true,
            },
            "/index.tsx": {
              code: entryIndexTsx,
              hidden: true,
            },
          }}
          customSetup={{
            dependencies: {
              "lucide-react": "^1.16.0",
              "clsx": "^2.1.1",
              "tailwind-merge": "^3.0.2",
            },
          }}
          options={{
            recompileMode: "immediate",
            recompileDelay: 300,
          }}
        >
          {/* Automatic Error Watcher */}
          <SandpackErrorWatcher
            onCatchError={(errorMsg) => {
              onTriggerSelfHeal(errorMsg);
            }}
          />

          {/* 1. Preview Only */}
          {viewMode === "preview" && (
            <div
              className={`h-full transition-all duration-300 mx-auto rounded-xl overflow-hidden border border-white/10 shadow-2xl flex flex-col ${
                viewport === "mobile"
                  ? "w-[375px] max-h-[750px]"
                  : viewport === "tablet"
                  ? "w-[768px] max-h-[850px]"
                  : "w-full h-full"
              }`}
            >
              <SandpackLayout className="!border-0 !rounded-none !h-full flex-1">
                <SandpackPreview
                  showNavigator={false}
                  showOpenInCodeSandbox={false}
                  showRefreshButton={true}
                  className="!h-full !w-full"
                />
              </SandpackLayout>
            </div>
          )}

          {/* 2. Code Editor Only */}
          {viewMode === "code" && (
            <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              <SandpackLayout className="!border-0 !rounded-none !h-full">
                <SandpackCodeEditor
                  showLineNumbers={true}
                  showInlineErrors={true}
                  wrapContent={true}
                  className="!h-full !w-full font-mono text-xs"
                />
              </SandpackLayout>
            </div>
          )}

          {/* 3. Split Preview & Code */}
          {viewMode === "split" && (
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div className="h-full rounded-xl overflow-hidden border border-white/10">
                <SandpackLayout className="!border-0 !rounded-none !h-full">
                  <SandpackCodeEditor
                    showLineNumbers={true}
                    showInlineErrors={true}
                    wrapContent={true}
                    className="!h-full !w-full font-mono text-xs"
                  />
                </SandpackLayout>
              </div>
              <div className="h-full rounded-xl overflow-hidden border border-white/10">
                <SandpackLayout className="!border-0 !rounded-none !h-full">
                  <SandpackPreview
                    showNavigator={false}
                    showOpenInCodeSandbox={false}
                    showRefreshButton={true}
                    className="!h-full !w-full"
                  />
                </SandpackLayout>
              </div>
            </div>
          )}

          {/* 4. Visual Comparison Mode (Target Screenshot vs Live Sandpack Clone) */}
          {viewMode === "compare" && originalScreenshot && (
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-3 p-1">
              {/* Left: Original Screenshot */}
              <div className="h-full rounded-xl overflow-hidden border border-white/10 bg-black flex flex-col">
                <div className="px-3 py-2 bg-white/5 border-b border-white/10 text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Original Website Target Snapshot</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                    Playwright Raw
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 bg-[#050608]">
                  <img
                    src={originalScreenshot}
                    alt="Original Target"
                    className="w-full object-contain rounded-lg"
                  />
                </div>
              </div>

              {/* Right: Live Sandpack Clone */}
              <div className="h-full rounded-xl overflow-hidden border border-white/10 flex flex-col">
                <div className="px-3 py-2 bg-white/5 border-b border-white/10 text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>AI Generated React Clone</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    Live Sandpack Preview
                  </span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <SandpackLayout className="!border-0 !rounded-none !h-full">
                    <SandpackPreview
                      showNavigator={false}
                      showOpenInCodeSandbox={false}
                      showRefreshButton={true}
                      className="!h-full !w-full"
                    />
                  </SandpackLayout>
                </div>
              </div>
            </div>
          )}
        </SandpackProvider>
      </div>
    </div>
  );
}
