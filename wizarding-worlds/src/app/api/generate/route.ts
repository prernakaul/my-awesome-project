import { NextRequest, NextResponse } from "next/server";

const GEMINI_API = "https://generativelanguage.googleapis.com/v1beta";

// POST — Start Veo video generation
export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key not configured." },
      { status: 500 }
    );
  }

  const fullPrompt = `Cinematic establishing shot, slow sweeping camera movement through ${prompt}. Photorealistic, volumetric lighting, atmospheric haze, magical atmosphere, rich vivid colors, cinematic color grading, film grain, 4K quality, fantasy film production value`;

  try {
    const res = await fetch(
      `${GEMINI_API}/models/veo-3.1-generate-preview:predictLongRunning`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          instances: [{ prompt: fullPrompt }],
          parameters: {
            aspectRatio: "16:9",
            durationSeconds: 8,
            resolution: "720p",
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Veo start error:", errText.substring(0, 500));
      throw new Error(`Video generation failed to start (${res.status})`);
    }

    const data = await res.json();
    const operationName = data.name;

    if (!operationName) {
      console.error("Veo response:", JSON.stringify(data).substring(0, 500));
      throw new Error("No operation returned from Veo");
    }

    return NextResponse.json({ operationName });
  } catch (error) {
    console.error("Generation error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to start video generation.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET — Poll Veo operation status
export async function GET(req: NextRequest) {
  const op = req.nextUrl.searchParams.get("op");

  if (!op) {
    return NextResponse.json({ error: "Missing operation name" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(`${GEMINI_API}/${op}`, {
      headers: { "x-goog-api-key": apiKey },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Poll error:", errText.substring(0, 500));
      throw new Error(`Polling failed (${res.status})`);
    }

    const data = await res.json();

    if (data.done) {
      // Extract video URI
      const videoUri =
        data.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;

      if (!videoUri) {
        console.error("Veo done response:", JSON.stringify(data).substring(0, 800));
        throw new Error("Video completed but no video URI found");
      }

      // Return a proxy URL so the client can access the video without the API key
      const proxyUrl = `/api/video?uri=${encodeURIComponent(videoUri)}`;
      return NextResponse.json({ done: true, videoUrl: proxyUrl });
    }

    return NextResponse.json({ done: false });
  } catch (error) {
    console.error("Poll error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to check status.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
