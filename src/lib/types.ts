export interface ExtractedColor {
  hex: string;
  usage: string;
}

export interface ExtractedFont {
  family: string;
  type: string;
}

export interface ScrapedSection {
  tag: string;
  id?: string;
  className?: string;
  heading?: string;
  summary: string;
}

export interface ScrapeResult {
  success: boolean;
  url: string;
  title: string;
  description: string;
  screenshotBase64: string; // data:image/jpeg;base64,...
  simplifiedDom: string;
  colors: ExtractedColor[];
  fonts: ExtractedFont[];
  sections: ScrapedSection[];
  error?: string;
  isPreset?: boolean;
}

export interface GenerateRequest {
  url: string;
  screenshotBase64?: string;
  simplifiedDom: string;
  metadata?: {
    title?: string;
    colors?: ExtractedColor[];
    fonts?: ExtractedFont[];
    sections?: ScrapedSection[];
  };
  customApiKey?: {
    gemini?: string;
    groq?: string;
    openai?: string;
  };
}

export interface GenerateResult {
  success: boolean;
  code: string;
  provider: "gemini" | "groq" | "openai" | "fallback";
  model: string;
  durationMs: number;
  error?: string;
}

export interface ModifyRequest {
  currentCode: string;
  userPrompt: string;
  customApiKey?: {
    gemini?: string;
    groq?: string;
    openai?: string;
  };
}

export interface ModifyResult {
  success: boolean;
  updatedCode: string;
  summary: string;
  provider: "groq" | "gemini" | "openai" | "fallback";
  durationMs: number;
  error?: string;
}

export interface HealRequest {
  currentCode: string;
  errorMessage: string;
  customApiKey?: {
    gemini?: string;
    groq?: string;
    openai?: string;
  };
}

export interface HealResult {
  success: boolean;
  healedCode: string;
  errorSummary: string;
  provider: string;
  durationMs: number;
  error?: string;
}

export type StepStatus = "pending" | "running" | "success" | "error";

export interface LogStep {
  id: string;
  title: string;
  detail?: string;
  status: StepStatus;
  timestamp: string;
}
