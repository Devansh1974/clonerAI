import { chromium } from "playwright";
import { ScrapeResult, ExtractedColor, ExtractedFont, ScrapedSection } from "./types";

export async function scrapeWebsite(targetUrl: string): Promise<ScrapeResult> {
  // Ensure valid URL protocol
  let formattedUrl = targetUrl.trim();
  if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
    formattedUrl = `https://${formattedUrl}`;
  }

  let browser = null;
  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    });

    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      deviceScaleFactor: 1,
    });

    const page = await context.newPage();

    // Navigate with graceful timeout fallback
    try {
      await page.goto(formattedUrl, {
        waitUntil: "networkidle",
        timeout: 20000,
      });
    } catch {
      // Fall back to domcontentloaded if networkidle times out
      try {
        await page.goto(formattedUrl, {
          waitUntil: "domcontentloaded",
          timeout: 15000,
        });
      } catch (err) {
        console.warn("Navigation warning:", err);
      }
    }

    // Wait a brief moment for any dynamic hydration
    await page.waitForTimeout(1000);

    // Capture full-page screenshot as JPEG buffer
    const screenshotBuffer = await page.screenshot({
      fullPage: true,
      type: "jpeg",
      quality: 80,
    });
    const screenshotBase64 = `data:image/jpeg;base64,${screenshotBuffer.toString("base64")}`;

    // Extract page metadata, colors, typography, and simplified DOM
    const extraction = await page.evaluate(() => {
      const title = document.title || "Cloned Website";
      const metaDesc =
        document.querySelector('meta[name="description"]')?.getAttribute("content") ||
        document.querySelector('meta[property="og:description"]')?.getAttribute("content") ||
        "";

      // Helper to convert rgb/rgba to hex
      function rgbToHex(rgbStr: string): string | null {
        const match = rgbStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return null;
        const r = parseInt(match[1]).toString(16).padStart(2, "0");
        const g = parseInt(match[2]).toString(16).padStart(2, "0");
        const b = parseInt(match[3]).toString(16).padStart(2, "0");
        return `#${r}${g}${b}`;
      }

      // 1. Extract dominant colors
      const colorCounts: { [hex: string]: number } = {};
      const allElements = Array.from(document.querySelectorAll("*")).slice(0, 300);

      allElements.forEach((el) => {
        const style = window.getComputedStyle(el);
        const bg = rgbToHex(style.backgroundColor);
        const color = rgbToHex(style.color);

        if (bg && bg !== "#ffffff" && bg !== "#000000" && !style.backgroundColor.includes("rgba(0, 0, 0, 0)")) {
          colorCounts[bg] = (colorCounts[bg] || 0) + 1;
        }
        if (color && color !== "#ffffff" && color !== "#000000") {
          colorCounts[color] = (colorCounts[color] || 0) + 1;
        }
      });

      const sortedColors = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([hex], idx) => ({
          hex,
          usage: idx === 0 ? "Primary Brand / Accent" : idx === 1 ? "Secondary" : "Background / Element",
        }));

      // 2. Extract typography
      const fontsFound = new Set<string>();
      const headings = Array.from(document.querySelectorAll("h1, h2, h3, header, nav"));
      headings.forEach((h) => {
        const font = window.getComputedStyle(h).fontFamily.split(",")[0].replace(/['"]/g, "").trim();
        if (font) fontsFound.add(font);
      });
      const bodyFont = window.getComputedStyle(document.body).fontFamily.split(",")[0].replace(/['"]/g, "").trim();
      if (bodyFont) fontsFound.add(bodyFont);

      const fonts = Array.from(fontsFound).slice(0, 3).map((family, idx) => ({
        family,
        type: idx === 0 ? "Headings / Display" : "Body / Interface",
      }));

      // 3. Extract layout sections
      const sections: { tag: string; id?: string; className?: string; heading?: string; summary: string }[] = [];
      const sectionElements = Array.from(document.querySelectorAll("nav, header, main, section, footer, [role='region']"));

      sectionElements.slice(0, 8).forEach((sec) => {
        const h = sec.querySelector("h1, h2, h3, h4")?.textContent?.trim();
        const textSnippet = (sec.textContent || "").replace(/\s+/g, " ").trim().slice(0, 120);
        sections.push({
          tag: sec.tagName.toLowerCase(),
          id: sec.id || undefined,
          className: sec.className ? String(sec.className).slice(0, 50) : undefined,
          heading: h || undefined,
          summary: textSnippet || "Section content",
        });
      });

      // 4. Extract simplified semantic HTML/DOM
      // Clone body to manipulate without altering live DOM
      const clone = document.body.cloneNode(true) as HTMLElement;

      // Remove unwanted noise: scripts, styles, iframes, svgs, noscripts
      const removeSelectors = [
        "script",
        "style",
        "svg",
        "iframe",
        "noscript",
        "template",
        "meta",
        "link",
        "canvas",
        "video",
        "audio",
      ];
      removeSelectors.forEach((sel) => {
        clone.querySelectorAll(sel).forEach((node) => node.remove());
      });

      // Strip comments and noisy attributes (data-*, aria-hidden, inline styles)
      function cleanNode(node: Node) {
        if (node.nodeType === Node.COMMENT_NODE) {
          node.parentNode?.removeChild(node);
          return;
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          // Keep only useful attributes: id, class, href, src, alt, placeholder
          const allowedAttrs = ["id", "class", "href", "src", "alt", "placeholder", "role"];
          Array.from(el.attributes).forEach((attr) => {
            if (!allowedAttrs.includes(attr.name)) {
              el.removeAttribute(attr.name);
            }
          });

          // Shorten image sources to just placeholders or preserve alt
          if (el.tagName.toLowerCase() === "img") {
            const alt = el.getAttribute("alt") || "Image";
            el.setAttribute("src", `https://placehold.co/600x400?text=${encodeURIComponent(alt.slice(0, 20))}`);
          }
        }
        node.childNodes.forEach((child) => cleanNode(child));
      }

      cleanNode(clone);

      // Compact HTML text
      let compactHtml = clone.innerHTML
        .replace(/>\s+</g, "><")
        .replace(/\s{2,}/g, " ")
        .trim();

      // Cap simplified DOM size to prevent token blowup (keep ~15,000 chars)
      if (compactHtml.length > 15000) {
        compactHtml = compactHtml.slice(0, 15000) + "\n<!-- [DOM truncated for brevity] -->";
      }

      return {
        title,
        description: metaDesc,
        colors: sortedColors,
        fonts,
        sections,
        simplifiedDom: compactHtml,
      };
    });

    await browser.close();
    browser = null;

    return {
      success: true,
      url: formattedUrl,
      title: extraction.title,
      description: extraction.description,
      screenshotBase64,
      simplifiedDom: extraction.simplifiedDom,
      colors: extraction.colors.length > 0 ? extraction.colors : [
        { hex: "#0f172a", usage: "Primary Slate" },
        { hex: "#3b82f6", usage: "Accent Blue" },
        { hex: "#f8fafc", usage: "Background Light" },
      ],
      fonts: extraction.fonts.length > 0 ? extraction.fonts : [{ family: "Inter", type: "Sans-Serif" }],
      sections: extraction.sections,
    };
  } catch (error: unknown) {
    if (browser) {
      try {
        await browser.close();
      } catch {
        // ignore
      }
    }
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Playwright scraping failed:", errMsg);
    return {
      success: false,
      url: formattedUrl,
      title: "Scrape Failed",
      description: "",
      screenshotBase64: "",
      simplifiedDom: `<div class="error-container"><h1>Could not scrape ${formattedUrl}</h1><p>${errMsg}</p></div>`,
      colors: [],
      fonts: [],
      sections: [],
      error: errMsg,
    };
  }
}
