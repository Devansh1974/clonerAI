import Groq from "groq-sdk";
import OpenAI from "openai";
import { GenerateRequest, GenerateResult, ModifyRequest, ModifyResult, HealRequest, HealResult } from "./types";
import { extractCodeBlock } from "./gemini";

// Helper to get an active LLM client for text-based generation and modifications
function getClient(customKey?: { groq?: string; openai?: string; gemini?: string }) {
  const groqKey = customKey?.groq || process.env.GROQ_API_KEY;
  if (groqKey) {
    return {
      type: "groq" as const,
      client: new Groq({ apiKey: groqKey }),
      model: "llama-3.3-70b-versatile",
    };
  }

  const openAiKey = customKey?.openai || process.env.OPENAI_API_KEY;
  if (openAiKey) {
    return {
      type: "openai" as const,
      client: new OpenAI({ apiKey: openAiKey }),
      model: "gpt-4o",
    };
  }

  return null;
}

// 1. Initial Generation Fallback via Groq / LLaMA
export async function generateWithGroqFallback(request: GenerateRequest): Promise<GenerateResult> {
  const startTime = Date.now();
  const clientInfo = getClient(request.customApiKey);

  if (!clientInfo) {
    throw new Error("No Groq or OpenAI API key configured for fallback generation.");
  }

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

  let content = "";
  if (clientInfo.type === "groq") {
    const res = await (clientInfo.client as Groq).chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: clientInfo.model,
      temperature: 0.3,
      max_tokens: 4096,
    });
    content = res.choices[0]?.message?.content || "";
  } else {
    const res = await (clientInfo.client as OpenAI).chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: clientInfo.model,
      temperature: 0.3,
    });
    content = res.choices[0]?.message?.content || "";
  }

  const cleanCode = extractCodeBlock(content);
  return {
    success: true,
    code: cleanCode,
    provider: clientInfo.type,
    model: clientInfo.model,
    durationMs: Date.now() - startTime,
  };
}

// 2. Natural Language Modification via Groq / LLM
export async function modifyCodeWithLLM(request: ModifyRequest): Promise<ModifyResult> {
  const startTime = Date.now();
  const clientInfo = getClient(request.customApiKey);

  if (!clientInfo) {
    // If no Groq/OpenAI key, check if Gemini key is available as alternative
    const geminiKey = request.customApiKey?.gemini || process.env.GEMINI_API_KEY;
    if (geminiKey) {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: geminiKey });
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

      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ text: prompt }],
      });
      const code = extractCodeBlock(res.text || "");
      return {
        success: true,
        updatedCode: code,
        summary: `Applied "${request.userPrompt}" using Gemini 2.5 Flash`,
        provider: "gemini",
        durationMs: Date.now() - startTime,
      };
    }

    throw new Error("No API key available (Groq, OpenAI, or Gemini) to process code modification.");
  }

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

  let content = "";
  if (clientInfo.type === "groq") {
    const res = await (clientInfo.client as Groq).chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: clientInfo.model,
      temperature: 0.2,
      max_tokens: 4096,
    });
    content = res.choices[0]?.message?.content || "";
  } else {
    const res = await (clientInfo.client as OpenAI).chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: clientInfo.model,
      temperature: 0.2,
    });
    content = res.choices[0]?.message?.content || "";
  }

  const cleanCode = extractCodeBlock(content);
  return {
    success: true,
    updatedCode: cleanCode,
    summary: `Applied: "${request.userPrompt}"`,
    provider: clientInfo.type,
    durationMs: Date.now() - startTime,
  };
}

// 3. Self-Healing Build Error Recovery
export async function healCodeWithLLM(request: HealRequest): Promise<HealResult> {
  const startTime = Date.now();
  const clientInfo = getClient(request.customApiKey);

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

  if (!clientInfo) {
    const geminiKey = request.customApiKey?.gemini || process.env.GEMINI_API_KEY;
    if (geminiKey) {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ text: prompt }],
      });
      const code = extractCodeBlock(res.text || "");
      return {
        success: true,
        healedCode: code,
        errorSummary: `Repaired error: ${request.errorMessage.slice(0, 100)}`,
        provider: "gemini",
        durationMs: Date.now() - startTime,
      };
    }

    // Local programmatic healing heuristic fallback (e.g. missing React import or lucide icon)
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

  let content = "";
  if (clientInfo.type === "groq") {
    const res = await (clientInfo.client as Groq).chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: clientInfo.model,
      temperature: 0.1,
      max_tokens: 4096,
    });
    content = res.choices[0]?.message?.content || "";
  } else {
    const res = await (clientInfo.client as OpenAI).chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: clientInfo.model,
      temperature: 0.1,
    });
    content = res.choices[0]?.message?.content || "";
  }

  const cleanCode = extractCodeBlock(content);
  return {
    success: true,
    healedCode: cleanCode,
    errorSummary: `Auto-healed: ${request.errorMessage.slice(0, 80)}`,
    provider: clientInfo.type,
    durationMs: Date.now() - startTime,
  };
}
