import { VisualizationPreferences, VisualizationResult } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Mock fallback — used when OPENAI_API_KEY is not set or in tests.
// Returns a curated decorated-house image from Unsplash.
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_IMAGES: Record<string, string[]> = {
  "classic-warm": [
    "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200&q=90",
    "https://images.unsplash.com/photo-1548105907-e4dae1e9a6d5?w=1200&q=90",
  ],
  "winter-white": [
    "https://images.unsplash.com/photo-1545048702-79362596cdc9?w=1200&q=90",
    "https://images.unsplash.com/photo-1606946887360-0c7ea0c08376?w=1200&q=90",
  ],
  "golden-luxury": [
    "https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=1200&q=90",
    "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200&q=90",
  ],
  colorful: [
    "https://images.unsplash.com/photo-1491300258918-c6f03438dab0?w=1200&q=90",
  ],
  "minimal-scandinavian": [
    "https://images.unsplash.com/photo-1606946887360-0c7ea0c08376?w=1200&q=90",
  ],
  "surprise-me": [
    "https://images.unsplash.com/photo-1548105907-e4dae1e9a6d5?w=1200&q=90",
  ],
};

function pickMockImage(style: string): string {
  const pool = MOCK_IMAGES[style] ?? MOCK_IMAGES["classic-warm"];
  return pool[Math.floor(Math.random() * pool.length)];
}

async function mockGenerate(
  originalImage: string,
  preferences: VisualizationPreferences
): Promise<VisualizationResult> {
  await new Promise((r) => setTimeout(r, 3000 + Math.random() * 2000));
  return {
    originalImage,
    generatedImage: pickMockImage(preferences.style),
    estimatedPriceMin: estimatePrice(preferences).min,
    estimatedPriceMax: estimatePrice(preferences).max,
    preferences,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Real AI generation — calls our Next.js API route which in turn calls
// OpenAI gpt-image-1, passing BOTH the customer's house photo AND the
// product reference image of our C9 lights so the model knows the exact
// bulb style to apply.
// ─────────────────────────────────────────────────────────────────────────────
async function realGenerate(
  originalImage: string,
  preferences: VisualizationPreferences
): Promise<VisualizationResult> {
  const response = await fetch("/api/visualize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      houseImageBase64: originalImage,
      preferences,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error ?? `API error ${response.status}`);
  }

  const data = await response.json();

  // gpt-image-1 returns base64; prefer that over a URL
  const generatedImage =
    data.generatedImageBase64 ?? data.generatedImageUrl;

  if (!generatedImage) {
    throw new Error("No image in API response");
  }

  return {
    originalImage,
    generatedImage,
    estimatedPriceMin: estimatePrice(preferences).min,
    estimatedPriceMax: estimatePrice(preferences).max,
    preferences,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — the only function the UI calls.
//
// Automatically uses the real OpenAI API when NEXT_PUBLIC_USE_AI=true is set
// (or when the API route succeeds). Falls back to the mock on error so the
// UI never hard-crashes during development without a key.
// ─────────────────────────────────────────────────────────────────────────────
export async function generateChristmasVisualization(
  originalImage: string,
  preferences: VisualizationPreferences
): Promise<VisualizationResult> {
  // Use real AI when the flag is enabled
  if (process.env.NEXT_PUBLIC_USE_AI === "true") {
    return realGenerate(originalImage, preferences);
  }

  // Otherwise fall through to mock (safe for dev / demo)
  return mockGenerate(originalImage, preferences);
}

// ─────────────────────────────────────────────────────────────────────────────
// Price estimation (used by both paths)
// ─────────────────────────────────────────────────────────────────────────────
function estimatePrice(prefs: VisualizationPreferences): {
  min: number;
  max: number;
} {
  const base: Record<string, number> = {
    minimal: 290,
    classic: 450,
    full: 650,
    spectacular: 900,
  };
  const multiplier: Record<string, number> = {
    "classic-warm": 1.0,
    "winter-white": 1.1,
    "golden-luxury": 1.4,
    colorful: 0.95,
    "minimal-scandinavian": 0.85,
    "surprise-me": 1.1,
  };
  const areaBonus = prefs.areas.length * 30;
  const basePrice = (base[prefs.decorationLevel] ?? 450) + areaBonus;
  const m = multiplier[prefs.style] ?? 1.0;
  const min = Math.round(basePrice * m);
  const max = Math.round(min * 1.35);
  return { min, max };
}
