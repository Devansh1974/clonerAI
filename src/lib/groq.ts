import Groq from "groq-sdk";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { GenerateRequest, GenerateResult, ModifyRequest, ModifyResult, HealRequest, HealResult } from "./types";
import { extractCodeBlock } from "./gemini";

// Helper to execute completions with multi-provider fallback: Groq -> OpenAI -> Gemini
async function executeChatCompletion(
  prompt: string,
  customKey?: { groq?: string; openai?: string; gemini?: string },
  temperature = 0.2
): Promise<{ text: string; provider: string; model: string }> {
  const groqKey = customKey?.groq || process.env.GROQ_API_KEY;
  const openAiKey = customKey?.openai || process.env.OPENAI_API_KEY;
  const geminiKey = customKey?.gemini || process.env.GEMINI_API_KEY;

  // 1. Try OpenAI if key is configured (high reliability & quota)
  if (openAiKey) {
    try {
      const openai = new OpenAI({ apiKey: openAiKey });
      const res = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o",
        temperature,
      });
      const text = res.choices[0]?.message?.content || "";
      if (text) {
        return { text, provider: "openai", model: "gpt-4o" };
      }
    } catch (err: any) {
      console.warn("OpenAI completion failed, trying next provider:", err?.message);
    }
  }

  // 2. Try Groq if key is configured
  if (groqKey) {
    const groq = new Groq({ apiKey: groqKey });
    const groqCandidateModels = [
      "openai/gpt-oss-120b",
      "llama-3.3-70b-versatile",
      "qwen/qwen3.8-27b",
      "openai/gpt-oss-20b",
    ];

    for (const model of groqCandidateModels) {
      try {
        const res = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model,
          temperature,
          max_tokens: 4096,
        });
        const text = res.choices[0]?.message?.content || "";
        if (text) {
          return { text, provider: "groq", model };
        }
      } catch (err: any) {
        console.warn(`Groq with model ${model} failed:`, err?.message);
      }
    }
  }

  // 3. Try Gemini (gemini-3.8-flash) as high-speed text completion fallback
  if (geminiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const res = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [{ text: prompt }],
      });
      const text = res.text || "";
      if (text) {
        return { text, provider: "gemini", model: "gemini-3.8-flash" };
      }
    } catch (err: any) {
      console.warn("Gemini text completion fallback failed:", err?.message);
    }
  }

  throw new Error("All configured AI providers (OpenAI, Groq, Gemini) failed to generate completion.");
}

// 1. Initial Generation Fallback
export async function generateWithGroqFallback(request: GenerateRequest): Promise<GenerateResult> {
  const startTime = Date.now();

  const prompt = `You are an expert Frontend AI Engineer. Your goal is to recreate a website's UI based on extracted HTML/DOM structure and design tokens. You must generate a SINGLE-FILE React component using Tailwind CSS that looks visually stunning and professional.

CRITICAL RULES:
1. NO EXPLANATIONS. Output ONLY valid React/Next.js code wrapped in a markdown \`\`\`tsx block.
2. Use Tailwind CSS for all styling. Do NOT use external CSS files.
3. Make the layout fully responsive (use md:, lg: prefixes).
4. For icons, strictly use \`lucide-react\` (import icons like Menu, X, ArrowRight, Check, Star, Shield, Sparkles, ChevronRight, Globe from 'lucide-react').
5. For images, use placeholder services like \`https://picsum.photos/width/height\` or \`https://placehold.co/widthxheight\` matching dimensions.
6. Guess the font families, exact hex colors, padding, and spacing from the visual context.
7. Break complex sections into smaller internal functional components within the same file for clean architecture.
8. Ensure the default export is \`export default function GeneratedWebsite() { ... }\`.

TARGET WEBSITE: ${request.url}
PAGE TITLE: ${request.metadata?.title || "Website"}

DETECTED DESIGN TOKENS:
Colors: ${JSON.stringify(request.metadata?.colors || [])}
Typography: ${JSON.stringify(request.metadata?.fonts || [])}
Sections: ${JSON.stringify(request.metadata?.sections || [])}

SIMPLIFIED SEMANTIC DOM STRUCTURE:
${request.simplifiedDom}`;

  const completion = await executeChatCompletion(prompt, request.customApiKey, 0.3);
  const cleanCode = extractCodeBlock(completion.text);

  return {
    success: true,
    code: cleanCode,
    provider: completion.provider as any,
    model: completion.model,
    durationMs: Date.now() - startTime,
  };
}

// 2. Natural Language Modification
export async function modifyCodeWithLLM(request: ModifyRequest): Promise<ModifyResult> {
  const startTime = Date.now();

  const prompt = `You are an expert React developer. You will be provided with an existing React component and a specific instruction from the user on how to modify it.

USER INSTRUCTION: ${request.userPrompt}

CRITICAL RULES:
1. Apply the requested changes flawlessly to the provided code.
2. Maintain the existing layout, structure, and design for anything not explicitly mentioned in the instruction.
3. Do not add comments explaining your changes.
4. Output the FULL, updated React file wrapped in a \`\`\`tsx block so it can be directly piped into a code runner.
5. Ensure the code remains syntactically correct and uses Tailwind CSS.

EXISTING CODE:
${request.currentCode}`;

  const completion = await executeChatCompletion(prompt, request.customApiKey, 0.2);
  const cleanCode = extractCodeBlock(completion.text);

  return {
    success: true,
    updatedCode: cleanCode,
    summary: `Applied "${request.userPrompt}" via ${completion.provider} (${completion.model})`,
    provider: completion.provider as any,
    durationMs: Date.now() - startTime,
  };
}

// 3. Self-Healing Build Error Recovery
export async function healCodeWithLLM(request: HealRequest): Promise<HealResult> {
  const startTime = Date.now();

  const prompt = `You are an expert React and TypeScript engineer. The following React component failed to compile or threw an error in a Sandpack sandbox.

ERROR MESSAGE:
${request.errorMessage}

CURRENT CODE:
${request.currentCode}

CRITICAL RULES:
1. Fix the root cause of the error immediately (e.g. missing import, unclosed tag, invalid JSX syntax, unknown lucide icon, or type error).
2. Maintain all other working features, Tailwind styles, and layout.
3. Output the FULL, valid, corrected React code wrapped in a \`\`\`tsx block so it can be directly piped into a code runner.
4. No conversational text or explanations.`;

  try {
    const completion = await executeChatCompletion(prompt, request.customApiKey, 0.1);
    const cleanCode = extractCodeBlock(completion.text);

    return {
      success: true,
      healedCode: cleanCode,
      errorSummary: `Auto-healed: ${request.errorMessage.slice(0, 80)}`,
      provider: completion.provider,
      durationMs: Date.now() - startTime,
    };
  } catch (err: any) {
    console.warn("LLM healing failed, applying heuristic fallback:", err?.message);
    let repaired = request.currentCode;
    if (!repaired.includes("import React")) {
      repaired = `import React from 'react';\n` + repaired;
    }
    return {
      success: true,
      healedCode: repaired,
      errorSummary: "Applied automatic syntax correction",
      provider: "heuristic-healer",
      durationMs: Date.now() - startTime,
    };
  }
}
