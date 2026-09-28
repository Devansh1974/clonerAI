import { NextRequest, NextResponse } from "next/server";
import { scrapeWebsite } from "@/lib/scraper";
import { PRESET_SITES } from "@/lib/presets";

export const maxDuration = 60; // Allow sufficient time for Playwright navigation

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, forceLive } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "Please provide a valid website URL." },
        { status: 400 }
      );
    }

    const cleanUrl = url.trim().toLowerCase();

    // Check if user is testing one of our curated benchmark presets (unless forceLive is requested)
    if (!forceLive) {
      const matchedPreset = PRESET_SITES.find(
        (p) =>
          cleanUrl.includes(p.id) ||
          cleanUrl === p.url.toLowerCase() ||
          cleanUrl === p.url.replace(/^https?:\/\//, "").toLowerCase()
      );

      if (matchedPreset) {
        return NextResponse.json({
          ...matchedPreset.scrapeData,
          isPreset: true,
          presetId: matchedPreset.id,
          presetDefaultCode: matchedPreset.defaultCode,
        });
      }
    }

    // Run headless Playwright scraper
    const scrapeResult = await scrapeWebsite(url);
    return NextResponse.json(scrapeResult);
  } catch (error: any) {
    console.error("API /api/scrape error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to scrape the specified website.",
      },
      { status: 500 }
    );
  }
}
