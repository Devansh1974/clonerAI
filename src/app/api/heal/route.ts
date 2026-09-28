import { NextRequest, NextResponse } from "next/server";
import { healCodeWithLLM } from "@/lib/groq";
import { HealRequest } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body: HealRequest = await req.json();

    if (!body.currentCode || !body.errorMessage) {
      return NextResponse.json(
        { success: false, error: "Both currentCode and errorMessage are required." },
        { status: 400 }
      );
    }

    const result = await healCodeWithLLM(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API /api/heal error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to auto-heal code." },
      { status: 500 }
    );
  }
}
