import { GoogleGenAI } from "@google/genai";
import { GenerateRequest, GenerateResult } from "./types";

const GEMINI_SYSTEM_PROMPT = `You are an expert Frontend AI Engineer. Your goal is to recreate a website's UI based on a provided screenshot and extracted HTML/DOM structure. You must generate a SINGLE-FILE React component using Tailwind CSS that looks visually identical to the provided screenshot.

CRITICAL RULES:
1. NO EXPLANATIONS. Output ONLY valid React/Next.js code wrapped in a markdown \`\`\`tsx block.
2. Use Tailwind CSS for all styling. Do NOT use external CSS files.
3. Make the layout fully responsive (use md:, lg: prefixes).
4. For icons, strictly use \`lucide-react\` (import icons like { Menu, X, ArrowRight, Check, Star, Shield, Sparkles, ChevronRight, Globe, Github } from 'lucide-react').
5. For images, use placeholder services like \`https://picsum.photos/width/height\` or \`https://placehold.co/widthxheight\` or reliable unsplash URLs, matching the approximate dimensions from the screenshot.
6. Guess the font families, exact hex colors, padding, and spacing from the visual context.
7. Break complex sections into smaller internal functional components within the same file for clean architecture.
8. Ensure the default export is \`export default function GeneratedWebsite() { ... }\`.
9. The code must be self-contained in a single file with all required React imports (import React, { useState, useEffect } from 'react').`;

export function extractCodeBlock(rawText: string): string {
  // Regex to extract code between ```tsx or ```jsx or ```
  const match = rawText.match(/```(?:tsx|jsx|javascript|typescript|react)?\s*([\s\S]*?)```/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  return rawText.trim();
}

export async function generateWithGemini(request: GenerateRequest): Promise<GenerateResult> {
  const startTime = Date.now();
  const apiKey = request.customApiKey?.gemini || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("No Gemini API key configured. Provide GEMINI_API_KEY in environment or settings modal.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Format visual and DOM payload
  const parts: any[] = [];

  // Add screenshot image if available
  if (request.screenshotBase64 && request.screenshotBase64.includes("base64,")) {
    const base64Data = request.screenshotBase64.split("base64,")[1];
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Data,
      },
    });
  }

  const contextPrompt = `${GEMINI_SYSTEM_PROMPT}

TARGET WEBSITE: ${request.url}
PAGE TITLE: ${request.metadata?.title || "Unknown"}

DETECTED DESIGN TOKENS:
Colors: ${JSON.stringify(request.metadata?.colors || [])}
Typography: ${JSON.stringify(request.metadata?.fonts || [])}
Sections: ${JSON.stringify(request.metadata?.sections || [])}

SIMPLIFIED SEMANTIC DOM STRUCTURE:
${request.simplifiedDom}

Now generate the complete, production-grade, visually stunning single-file React component clone. Output ONLY the code inside \`\`\`tsx ... \`\`\`.`;

  parts.push({ text: contextPrompt });

  // Try gemini-2.5-flash first, fallback to gemini-2.0-flash if needed
  let responseText = "";
  let modelUsed = "gemini-2.5-flash";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: parts,
    });
    responseText = response.text || "";
  } catch (err: any) {
    console.warn("gemini-2.5-flash call failed, trying gemini-2.0-flash:", err?.message);
    modelUsed = "gemini-2.0-flash";
    const fallbackResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: parts,
    });
    responseText = fallbackResponse.text || "";
  }

  const cleanCode = extractCodeBlock(responseText);

  if (!cleanCode || cleanCode.length < 50) {
    throw new Error("Gemini returned empty or invalid response code");
  }

  return {
    success: true,
    code: cleanCode,
    provider: "gemini",
    model: modelUsed,
    durationMs: Date.now() - startTime,
  };
}
