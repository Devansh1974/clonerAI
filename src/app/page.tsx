"use client";

import React, { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import Navbar from "@/components/Navbar";
import LandingHero from "@/components/LandingHero";
import TerminalLogs from "@/components/TerminalLogs";
import ModificationChat from "@/components/ModificationChat";
import SandpackWorkspace from "@/components/SandpackWorkspace";
import ApiKeyModal from "@/components/ApiKeyModal";
import VisualComparisonModal from "@/components/VisualComparisonModal";
import { PRESET_SITES, PresetSite } from "@/lib/presets";
import { LogStep, ScrapeResult } from "@/lib/types";

export default function HomePage() {
  const [hasActiveClone, setHasActiveClone] = useState(false);
  const [targetUrl, setTargetUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string | undefined>();

  // State for scraped metadata and generated code
  const [scrapeData, setScrapeData] = useState<ScrapeResult | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [activeProvider, setActiveProvider] = useState<string>("");
  const [generationDuration, setGenerationDuration] = useState<number>(0);

  // Self-healing state
  const [healingState, setHealingState] = useState<{
    isHealing: boolean;
    errorCount: number;
    lastHealedError?: string;
  }>({
    isHealing: false,
    errorCount: 0,
  });

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isScreenshotModalOpen, setIsScreenshotModalOpen] = useState(false);

  // Terminal log steps
  const [steps, setSteps] = useState<LogStep[]>([]);

  const getStoredApiKeys = () => {
    if (typeof window === "undefined") return {};
    return {
      gemini: localStorage.getItem("CLONER_GEMINI_API_KEY") || undefined,
      groq: localStorage.getItem("CLONER_GROQ_API_KEY") || undefined,
      openai: localStorage.getItem("CLONER_OPENAI_API_KEY") || undefined,
    };
  };

  const addStep = (id: string, title: string, detail?: string, status: LogStep["status"] = "running") => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setSteps((prev) => {
      const exists = prev.find((s) => s.id === id);
      if (exists) {
        return prev.map((s) => (s.id === id ? { ...s, title, detail, status, timestamp } : s));
      }
      return [...prev, { id, title, detail, status, timestamp }];
    });
  };

  const updateStepStatus = (id: string, status: LogStep["status"], detail?: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, detail: detail || s.detail } : s))
    );
  };

  // Full Autonomous Cloning Pipeline
  const handleStartClone = async (url: string) => {
    setIsLoading(true);
    setHasActiveClone(true);
    setTargetUrl(url);
    setActivePresetId(undefined);
    setSteps([]);
    setGeneratedCode("");

    const startTime = Date.now();

    try {
      // Step 1: Headless Browser Scrape
      addStep("step-browser", "Launching headless Chromium browser agent...", "Initializing Playwright instance with stealth flags", "running");
      
      const scrapeRes = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const scrapeJson: ScrapeResult = await scrapeRes.json();

      if (!scrapeJson.success && !scrapeJson.simplifiedDom) {
        throw new Error(scrapeJson.error || "Failed to navigate to target website.");
      }

      setScrapeData(scrapeJson);
      updateStepStatus("step-browser", "success", `Navigated to ${scrapeJson.url} and captured full-page DOM`);

      // Step 2: Token extraction
      addStep("step-tokens", "Extracting semantic DOM, colors & typography...", `Identified ${scrapeJson.colors?.length || 0} colors, ${scrapeJson.fonts?.length || 0} fonts, and ${scrapeJson.sections?.length || 0} layout blocks`, "success");

      // Step 3: Synthesis via Multimodal Vision & LLM Fallback
      addStep("step-synthesis", "Synthesizing React component with Gemini 2.5 Flash...", "Passing viewport snapshot + semantic DOM into multimodal vision model", "running");

      const customApiKey = getStoredApiKeys();

      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: scrapeJson.url,
          screenshotBase64: scrapeJson.screenshotBase64,
          simplifiedDom: scrapeJson.simplifiedDom,
          metadata: {
            title: scrapeJson.title,
            colors: scrapeJson.colors,
            fonts: scrapeJson.fonts,
            sections: scrapeJson.sections,
          },
          customApiKey,
        }),
      });

      const genJson = await genRes.json();

      if (!genJson.success && !genJson.code) {
        throw new Error(genJson.error || "Synthesis failed.");
      }

      setGeneratedCode(genJson.code);
      setActiveProvider(genJson.provider || "gemini");
      setGenerationDuration(Date.now() - startTime);

      updateStepStatus(
        "step-synthesis",
        "success",
        `Synthesized single-file React component using ${genJson.model || "Gemini"} (${((Date.now() - startTime) / 1000).toFixed(1)}s)`
      );

      // Step 4: Validate and Mount into Sandpack
      addStep("step-validate", "Mounting into Sandpack live preview sandbox...", "Injected Tailwind runtime and lucide-react iconography", "success");

      // Celebrate success
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch {
        // confetti optional
      }
    } catch (err: any) {
      console.error("Cloning pipeline failed:", err);
      addStep("step-error", "Cloning encountered an error", err?.message || String(err), "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Instant Benchmark Preset Selection
  const handleSelectPreset = (preset: PresetSite) => {
    setHasActiveClone(true);
    setTargetUrl(preset.url);
    setActivePresetId(preset.id);
    setScrapeData(preset.scrapeData);
    setGeneratedCode(preset.defaultCode);
    setActiveProvider("preset-benchmark");
    setGenerationDuration(350);

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setSteps([
      {
        id: "step-browser",
        title: `Loaded benchmark archetype: ${preset.name}`,
        detail: `Pre-extracted layout and tokens for ${preset.url}`,
        status: "success",
        timestamp: now,
      },
      {
        id: "step-tokens",
        title: "Extracted design tokens and typography",
        detail: `${preset.scrapeData.colors.length} palette tokens • ${preset.scrapeData.fonts.length} font stacks`,
        status: "success",
        timestamp: now,
      },
      {
        id: "step-synthesis",
        title: "Synthesized production-grade component",
        detail: "Single-file React + Tailwind CSS with responsive breakpoints",
        status: "success",
        timestamp: now,
      },
      {
        id: "step-validate",
        title: "Sandpack live preview active",
        detail: "Live hot-reloading and modification agent ready",
        status: "success",
        timestamp: now,
      },
    ]);
  };

  // Natural Language Modification Handler
  const handleModify = async (instruction: string) => {
    if (!generatedCode) return;
    setIsModifying(true);

    try {
      const customApiKey = getStoredApiKeys();
      const res = await fetch("/api/modify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentCode: generatedCode,
          userPrompt: instruction,
          customApiKey,
        }),
      });

      const data = await res.json();
      if (!data.success || !data.updatedCode) {
        throw new Error(data.error || "Failed to apply modification.");
      }

      setGeneratedCode(data.updatedCode);

      addStep(
        `mod-${Date.now()}`,
        `Applied natural-language modification: "${instruction}"`,
        `Synthesized in ${(data.durationMs / 1000).toFixed(1)}s using ${data.provider}`,
        "success"
      );
    } catch (err: any) {
      console.error("Modification failed:", err);
      addStep(
        `mod-err-${Date.now()}`,
        `Modification error: "${instruction}"`,
        err?.message || "Failed to update code",
        "error"
      );
      throw err;
    } finally {
      setIsModifying(false);
    }
  };

  // Automated Self-Healing Error Recovery
  const handleTriggerSelfHeal = useCallback(async (errorMessage: string) => {
    if (healingState.isHealing || !generatedCode) return;

    // Check if error is substantial (ignore generic warning logs)
    if (!errorMessage.includes("Error") && !errorMessage.includes("SyntaxError") && !errorMessage.includes("not defined")) {
      return;
    }

    setHealingState((prev) => ({
      ...prev,
      isHealing: true,
      lastHealedError: errorMessage,
    }));

    addStep(
      `heal-${Date.now()}`,
      "Sandpack compilation error caught — self-healing triggered...",
      errorMessage.slice(0, 100),
      "running"
    );

    try {
      const customApiKey = getStoredApiKeys();
      const res = await fetch("/api/heal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentCode: generatedCode,
          errorMessage,
          customApiKey,
        }),
      });

      const data = await res.json();
      if (data.success && data.healedCode) {
        setGeneratedCode(data.healedCode);
        setHealingState((prev) => ({
          isHealing: false,
          errorCount: prev.errorCount + 1,
        }));

        addStep(
          `heal-success-${Date.now()}`,
          "Self-healing completed successfully",
          `Resolved runtime error in ${(data.durationMs / 1000).toFixed(1)}s`,
          "success"
        );
      } else {
        setHealingState((prev) => ({ ...prev, isHealing: false }));
      }
    } catch (err: any) {
      console.warn("Self-healing failed:", err);
      setHealingState((prev) => ({ ...prev, isHealing: false }));
    }
  }, [generatedCode, healingState.isHealing]);

  const handleReset = () => {
    setHasActiveClone(false);
    setTargetUrl("");
    setScrapeData(null);
    setGeneratedCode("");
    setSteps([]);
    setActivePresetId(undefined);
  };

  return (
    <div className="min-h-screen bg-[#06070a] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative">
      {/* Fixed Ambient Glow Orbs (constant, minimal dark aesthetic) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-indigo-600/12 via-purple-600/6 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-1/3 -right-32 w-[600px] h-[500px] bg-gradient-to-l from-indigo-500/6 to-transparent blur-[130px] rounded-full" />
        <div className="absolute bottom-10 -left-32 w-[600px] h-[500px] bg-gradient-to-r from-purple-500/6 to-transparent blur-[130px] rounded-full" />
      </div>

      {/* Top Navbar */}
      <Navbar
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasActiveClone={hasActiveClone}
        activePresetId={activePresetId}
      />

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col">
        {!hasActiveClone ? (
          /* Landing Hero State */
          <LandingHero
            onStartClone={handleStartClone}
            onSelectPreset={handleSelectPreset}
            isLoading={isLoading}
          />
        ) : (
          /* Split View Workspace */
          <div className="flex-1 p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-[1920px] mx-auto w-full h-[calc(100vh-4rem)] min-h-[700px]">
            {/* Left Panel: Terminal Logs & Natural Language Modification Chat */}
            <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-3 h-full overflow-hidden">
              <div className="flex-1 min-h-[300px] overflow-hidden">
                <TerminalLogs
                  steps={steps}
                  scrapeData={scrapeData}
                  activeProvider={activeProvider}
                  generationDuration={generationDuration}
                  onOpenScreenshotModal={() => setIsScreenshotModalOpen(true)}
                />
              </div>

              <div className="shrink-0">
                <ModificationChat
                  onModify={handleModify}
                  isModifying={isModifying}
                  healingState={healingState}
                />
              </div>
            </div>

            {/* Right Panel: Sandpack Live In-Browser Preview & Code Editor */}
            <div className="lg:col-span-8 xl:col-span-8 h-full overflow-hidden flex flex-col">
              <SandpackWorkspace
                code={generatedCode}
                onCodeChange={(newCode) => setGeneratedCode(newCode)}
                originalScreenshot={scrapeData?.screenshotBase64}
                onTriggerSelfHeal={handleTriggerSelfHeal}
                isHealing={healingState.isHealing}
              />
            </div>
          </div>
        )}
      </main>

      {/* API Key Configuration Modal */}
      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Target Screenshot Zoom Modal */}
      {scrapeData?.screenshotBase64 && (
        <VisualComparisonModal
          isOpen={isScreenshotModalOpen}
          onClose={() => setIsScreenshotModalOpen(false)}
          screenshotUrl={scrapeData.screenshotBase64}
          websiteUrl={scrapeData.url}
          pageTitle={scrapeData.title}
        />
      )}
    </div>
  );
}
