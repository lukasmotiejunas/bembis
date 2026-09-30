import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

// Per-product descriptions used both for image selection and prompt generation.
const PRODUCT_META: Record<string, { file: string; bulbDesc: string; glowDesc: string }> = {
  "1": {
    file: "product-1.jpg",
    bulbDesc: "warm white filament C9 bulbs with clear amber glass — the classic elongated candle shape with a visible glowing filament inside",
    glowDesc: "warm amber",
  },
  "2": {
    file: "product-2.jpg",
    bulbDesc: "multicolor opaque C9 bulbs in red, green, orange, blue, and yellow — solid-color ceramic-style finish",
    glowDesc: "multicolor (red, green, orange, blue, yellow)",
  },
  "3": {
    file: "product-3.jpg",
    bulbDesc: "blue and white opaque C9 bulbs alternating — crisp winter palette with solid ceramic-style finish",
    glowDesc: "blue and white",
  },
  "4": {
    file: "product-4.jpg",
    bulbDesc: "multicolor opaque C9 bulbs in red, green, orange, blue, and yellow — solid-color ceramic-style finish",
    glowDesc: "multicolor (red, green, orange, blue, yellow)",
  },
  "5": {
    file: "product-5.jpg",
    bulbDesc: "red and white opaque C9 bulbs alternating — classic Christmas palette with solid ceramic-style finish",
    glowDesc: "red and white",
  },
  "6": {
    file: "product-6.jpg",
    bulbDesc: "warm amber opaque C9 bulbs — rich golden-amber glow with solid ceramic-style finish",
    glowDesc: "warm amber",
  },
};

function getProductMeta(productId?: string) {
  return PRODUCT_META[productId ?? "1"] ?? PRODUCT_META["1"];
}

function buildPrompt(preferences: {
  style: string;
  lightColor: string;
  decorationLevel: string;
  areas: string[];
  specialRequest?: string;
  selectedProductId?: string;
}): string {
  const meta = getProductMeta(preferences.selectedProductId);

  const levelMap: Record<string, string> = {
    minimal: "sparse, minimal coverage — only the main roofline",
    classic: "standard coverage — roofline, main windows, and entrance",
    full: "full coverage — all rooflines, all windows, entrance, trees and bushes",
    spectacular: "spectacular dense coverage — every edge, window, column, tree and garden feature",
  };

  const areaDescriptions = preferences.areas
    .map((a) => a.replace("-", " "))
    .join(", ");

  return `Edit this house photo to show it professionally decorated with the exact C9 Christmas lights shown in the second reference image.

The lights to use: ${meta.bulbDesc}. Match the reference image exactly — same bulb shape, same color, same wire style.

Apply the following:
- Coverage: ${levelMap[preferences.decorationLevel] ?? levelMap["classic"]}
- Areas to decorate: ${areaDescriptions}
- Light glow color: ${meta.glowDesc}
${preferences.specialRequest ? `- Special request: ${preferences.specialRequest}` : ""}

Requirements:
- Use the EXACT bulbs visible in the reference product image — replicate the color, finish, and shape precisely
- String the lights naturally along architectural features — sagging slightly between attachment points, following the roofline contour
- Preserve the house's original architecture, proportions, windows, doors, and surroundings exactly — only ADD lights and their glow
- Show the scene at dusk or early evening so the lights are visible and glowing
- The ${meta.glowDesc} light should cast a natural glow on the surrounding walls and ground
- Make it completely photorealistic — should look like a professional photograph, not a rendering
- Do not add snow, wreaths, or other decorations — only the C9 string lights`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { houseImageBase64, preferences } = body;

    if (!houseImageBase64 || !preferences) {
      return NextResponse.json(
        { error: "Missing houseImageBase64 or preferences" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });

    // Convert base64 data URL → Buffer for house image
    const base64Data = houseImageBase64.replace(/^data:image\/\w+;base64,/, "");
    const houseBuffer = Buffer.from(base64Data, "base64");

    // Determine image type from data URL
    const mimeMatch = houseImageBase64.match(/^data:(image\/\w+);base64,/);
    const mimeType = (mimeMatch?.[1] ?? "image/jpeg") as
      | "image/jpeg"
      | "image/png"
      | "image/webp"
      | "image/gif";

    // Load the product reference image matching the user's selection
    const productMeta = getProductMeta(preferences.selectedProductId);
    const productImagePath = path.join(process.cwd(), "public", productMeta.file);
    const productBuffer = fs.readFileSync(productImagePath);

    // Build File objects for the OpenAI SDK
    const houseFile = new File([houseBuffer], "house.jpg", { type: mimeType });
    const productFile = new File([productBuffer], "product-lights.jpg", {
      type: "image/jpeg",
    });

    const prompt = buildPrompt(preferences);

    // Call gpt-image-1 edit endpoint with both images:
    // [0] house photo — the base image to edit
    // [1] product reference — so the model knows the exact bulb style
    const response = await client.images.edit({
      model: "gpt-image-1",
      image: [houseFile, productFile],
      prompt,
      n: 1,
      size: "1536x1024",
      quality: "high",
    });

    const imageData = response.data?.[0];
    if (!imageData) {
      throw new Error("No image returned from OpenAI");
    }

    // gpt-image-1 returns base64 by default
    const resultBase64 = imageData.b64_json;
    const resultUrl = imageData.url;

    return NextResponse.json({
      generatedImageBase64: resultBase64
        ? `data:image/png;base64,${resultBase64}`
        : null,
      generatedImageUrl: resultUrl ?? null,
    });
  } catch (err: any) {
    console.error("[/api/visualize] Error:", err?.message ?? err);

    // Surface OpenAI API errors clearly
    const message =
      err?.status === 401
        ? "Invalid OpenAI API key"
        : err?.status === 429
          ? "OpenAI rate limit reached — try again in a moment"
          : err?.message ?? "Image generation failed";

    return NextResponse.json({ error: message }, { status: err?.status ?? 500 });
  }
}
