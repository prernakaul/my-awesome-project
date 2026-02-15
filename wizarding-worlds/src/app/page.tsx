"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import MagicParticles from "@/components/MagicParticles";
import CauldronLoader from "@/components/CauldronLoader";

const CinematicViewer = dynamic(() => import("@/components/CinematicViewer"), {
  ssr: false,
});

const EXAMPLE_PROMPTS = [
  {
    name: "Myrtle's Potions Lab",
    prompt:
      "Moaning Myrtle's abandoned bathroom transformed into a clandestine potions laboratory inside a medieval castle, stone walls seeping moisture, low vaulted ceiling, green-tinged torches casting eerie flickering glow, bubbling cauldron releasing greenish-brown smoke, shelves with potion ingredients jars and dried herbs, spell book open on wooden stool, pewter scales and mortar, glass vials, misty fog, muted earthy tones with green and brown accents",
  },
  {
    name: "Hogwarts Great Hall",
    prompt:
      "The Great Hall of Hogwarts at night during a magical feast, floating candles illuminating a vast gothic chamber, four long house tables with golden plates and goblets, head table with ornate chairs, stained glass windows, house banners hanging from ceiling, warm golden torch light, rich colors of red gold green blue silver",
  },
  {
    name: "Forbidden Forest",
    prompt:
      "A clearing deep inside the Forbidden Forest at twilight, ancient towering trees with twisted trunks surrounding the space, bioluminescent mushrooms on the forest floor, ethereal blue and purple fairy lights floating between branches, giant spider webs glistening, mystical fog, rays of moonlight, magical glowing plants and flowers",
  },
  {
    name: "Diagon Alley Shop",
    prompt:
      "Inside a magical shop on Diagon Alley filled with enchanted objects, shelves floor to ceiling packed with mysterious artifacts, glowing crystals, floating objects, a dusty counter with a brass register, magical creatures in cages, wands in display cases, warm candlelight, rich wooden interior, cozy and mysterious atmosphere",
  },
  {
    name: "Room of Requirement",
    prompt:
      "The Room of Requirement configured as a vast magical training ground, cathedral-like stone space, practice dummies on stands, walls lined with magical artifacts on shelves, crystals in the ceiling casting prismatic rainbow light, enchanted books on pedestals, mysterious ancient runes glowing on the floor, torch-lit stone pillars",
  },
];

const SPELL_MESSAGES = [
  "Conjuring your wizarding world...",
  "Casting visual enchantments...",
  "Brewing cinematic magic...",
  "Weaving reality from imagination...",
  "Summoning the scene...",
  "Channeling ancient spells...",
  "The magic is taking shape...",
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spellRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cycle through spell messages during generation
  useEffect(() => {
    if (isGenerating) {
      let idx = 0;
      setStatusMessage(SPELL_MESSAGES[0]);
      spellRef.current = setInterval(() => {
        idx = (idx + 1) % SPELL_MESSAGES.length;
        setStatusMessage(SPELL_MESSAGES[idx]);
      }, 5000);
    } else {
      if (spellRef.current) clearInterval(spellRef.current);
    }
    return () => {
      if (spellRef.current) clearInterval(spellRef.current);
    };
  }, [isGenerating]);

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);

    try {
      // Step 1: Start Veo generation
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to start generation");
      }

      const { operationName } = data;

      // Step 2: Poll for completion
      await new Promise<void>((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 90; // ~7.5 minutes at 5s intervals

        pollRef.current = setInterval(async () => {
          attempts++;

          if (attempts > maxAttempts) {
            if (pollRef.current) clearInterval(pollRef.current);
            reject(new Error("Generation timed out. Please try again."));
            return;
          }

          try {
            const pollRes = await fetch(
              `/api/generate?op=${encodeURIComponent(operationName)}`
            );
            const pollData = await pollRes.json();

            if (pollData.error) {
              if (pollRef.current) clearInterval(pollRef.current);
              reject(new Error(pollData.error));
              return;
            }

            if (pollData.done && pollData.videoUrl) {
              if (pollRef.current) clearInterval(pollRef.current);
              setVideoUrl(pollData.videoUrl);
              resolve();
            }
          } catch {
            // Network blip — keep polling
          }
        }, 5000);
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsGenerating(false);
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }
  }, [prompt, isGenerating]);

  const handleExit = useCallback(() => {
    setVideoUrl(null);
  }, []);

  // Full-screen cinematic video
  if (videoUrl) {
    return <CinematicViewer videoUrl={videoUrl} onExit={handleExit} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <MagicParticles />

      {/* Background gradient */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at top, #1a0a2e 0%, #0a0a12 50%, #0d1b2a 100%)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center min-h-screen">
        {/* Header */}
        <header className="w-full text-center pt-12 pb-6 px-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50" />
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gold"
            >
              <path
                d="M12 2L15 8.5L22 9.5L17 14.5L18 21.5L12 18L6 21.5L7 14.5L2 9.5L9 8.5L12 2Z"
                fill="currentColor"
                opacity="0.8"
              />
            </svg>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text mb-3"
            style={{
              fontFamily: "'Cinzel Decorative', cursive",
              backgroundImage:
                "linear-gradient(135deg, #f0d77b 0%, #c9a84c 40%, #8b6914 60%, #c9a84c 80%, #f0d77b 100%)",
              backgroundSize: "200% auto",
              animation: "shimmer 4s linear infinite",
            }}
          >
            Wizarding Worlds
          </h1>

          <p
            className="text-gold/60 text-lg tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            A Project Genie Companion
          </p>

          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-gold/30" />
            <div className="w-2 h-2 rounded-full bg-gold/40" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-gold/30" />
          </div>
        </header>

        {/* Loading State */}
        {isGenerating && (
          <div className="flex flex-col items-center my-8">
            <CauldronLoader />
            <p
              className="text-gold/60 text-base mt-4 animate-pulse transition-all duration-500"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {statusMessage}
            </p>
            <p className="text-gold/30 text-xs mt-2" style={{ fontFamily: "'Cinzel', serif" }}>
              Veo is crafting your video — this may take a minute or two
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mx-4 mb-6 max-w-2xl w-full px-6 py-4 rounded-xl bg-crimson/20 border border-crimson/40 text-red-300 text-center">
            <p style={{ fontFamily: "'Cinzel', serif" }}>{error}</p>
          </div>
        )}

        {/* Prompt Input Section */}
        {!isGenerating && (
          <div className="w-full max-w-3xl px-4 mb-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/20 via-gold/5 to-gold/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your wizarding world... e.g., 'A mystical potions classroom deep within the dungeons of an ancient castle, lit by floating candles and bubbling cauldrons'"
                className="magical-textarea relative w-full h-40 p-6 rounded-2xl text-parchment placeholder:text-gold/30 text-lg resize-none"
                style={{ fontFamily: "'Crimson Text', serif" }}
                maxLength={2000}
              />
            </div>

            <div className="flex justify-between items-center mt-2 px-2">
              <span className="text-gold/30 text-sm">
                {prompt.length} / 2000
              </span>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="generate-btn px-12 py-4 rounded-xl text-lg tracking-wider"
              >
                Generate Genie World
              </button>
            </div>
          </div>
        )}

        {/* Example Prompts */}
        {!isGenerating && (
          <div className="w-full max-w-4xl px-4 mb-16">
            <p
              className="text-center text-gold/40 text-sm tracking-[0.2em] uppercase mb-6"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Or choose a wizarding world
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {EXAMPLE_PROMPTS.map((example) => (
                <button
                  key={example.name}
                  onClick={() => setPrompt(example.prompt)}
                  className="group relative p-5 rounded-xl text-left transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background:
                      "linear-gradient(135deg, #0d1b2a 0%, #1a0a2e 100%)",
                    border: "1px solid #c9a84c22",
                  }}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/5 to-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h3
                    className="relative text-gold font-semibold mb-2"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {example.name}
                  </h3>
                  <p className="relative text-gold/40 text-sm line-clamp-3">
                    {example.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-auto pb-8 text-center">
          <p
            className="text-gold/20 text-sm"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Powered by Google Veo AI
          </p>
        </footer>
      </div>
    </div>
  );
}
