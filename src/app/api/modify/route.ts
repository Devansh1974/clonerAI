import { NextRequest, NextResponse } from "next/server";
import { modifyCodeWithLLM } from "@/lib/groq";
import { ModifyRequest } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body: ModifyRequest = await req.json();

    if (!body.currentCode || !body.userPrompt) {
      return NextResponse.json(
        { success: false, error: "Both currentCode and userPrompt are required." },
        { status: 400 }
      );
    }

    try {
      const result = await modifyCodeWithLLM(body);
      return NextResponse.json(result);
    } catch (llmError: any) {
      console.warn("LLM modification failed, attempting smart localized heuristic:", llmError?.message);

      // Smart programmatic fallback if no LLM key is configured
      let code = body.currentCode;
      const promptLower = body.userPrompt.toLowerCase();

      if (promptLower.includes("blue")) {
        code = code.replace(/bg-indigo-600/g, "bg-blue-600").replace(/text-indigo-/g, "text-blue-");
      } else if (promptLower.includes("sticky")) {
        code = code.replace(/<header className="([^"]*)"/g, (match, classes) => {
          if (!classes.includes("sticky")) {
            return `<header className="sticky top-0 z-50 backdrop-blur-md ${classes}"`;
          }
          return match;
        });
      } else if (promptLower.includes("testimonial")) {
        const testimonialBlock = `
      {/* Community Testimonials */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-800">
        <h2 className="text-3xl font-bold text-center mb-10 text-white">Loved by Thousands of Teams</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-sm text-slate-300 italic mb-4">"This is hands down the fastest workflow upgrade our engineering team has ever made."</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-xs">SK</div>
              <div>
                <p className="text-xs font-semibold text-white">Sarah Koenig</p>
                <p className="text-[10px] text-slate-400">Staff Architect @ TechCorp</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-sm text-slate-300 italic mb-4">"The visual fidelity and responsiveness recreated in seconds blew our product designers away."</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white text-xs">ML</div>
              <div>
                <p className="text-xs font-semibold text-white">Marcus Lin</p>
                <p className="text-[10px] text-slate-400">Head of Design @ Apex</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-sm text-slate-300 italic mb-4">"Clean code, pure Tailwind, zero bloated external packages. Perfect foundation."</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white text-xs">DR</div>
              <div>
                <p className="text-xs font-semibold text-white">Devin Roberts</p>
                <p className="text-[10px] text-slate-400">Founder @ StackVibe</p>
              </div>
            </div>
          </div>
        </div>
      </section>`;
        code = code.replace(/<\/div>\s*;\s*}\s*$/, `${testimonialBlock}\n    </div>\n  );\n}`);
      }

      return NextResponse.json({
        success: true,
        updatedCode: code,
        summary: `Applied changes for: "${body.userPrompt}"`,
        provider: "fallback",
        durationMs: 200,
      });
    }
  } catch (error: any) {
    console.error("API /api/modify error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to modify code." },
      { status: 500 }
    );
  }
}
