import { NextRequest, NextResponse } from "next/server";

// Proxy video download from Google — adds the API key so the client doesn't need it
export async function GET(req: NextRequest) {
  const uri = req.nextUrl.searchParams.get("uri");

  if (!uri) {
    return NextResponse.json({ error: "Missing video URI" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    // The URI from Veo needs the API key appended or in the header
    const separator = uri.includes("?") ? "&" : "?";
    const videoRes = await fetch(`${uri}${separator}key=${apiKey}`, {
      headers: { "x-goog-api-key": apiKey },
    });

    if (!videoRes.ok) {
      throw new Error(`Video download failed (${videoRes.status})`);
    }

    const videoBuffer = await videoRes.arrayBuffer();

    return new NextResponse(videoBuffer, {
      headers: {
        "Content-Type": videoRes.headers.get("Content-Type") || "video/mp4",
        "Content-Length": videoBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Video proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 });
  }
}
