"use client";

import { useEffect, useState } from "react";

const SPELL_MESSAGES = [
  "Brewing your magical world...",
  "Enchanting the environment...",
  "Conjuring mystical landscapes...",
  "Weaving spatial enchantments...",
  "Summoning ethereal visions...",
  "Channeling arcane energies...",
  "Manifesting your wizarding world...",
  "Casting Aparecium on your scene...",
];

export default function CauldronLoader() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [bubbles, setBubbles] = useState<
    { id: number; left: number; delay: number; size: number }[]
  >([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % SPELL_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setBubbles(
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: 30 + Math.random() * 40,
        delay: Math.random() * 2,
        size: Math.random() * 12 + 6,
      }))
    );
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 py-16">
      {/* Cauldron SVG */}
      <div className="relative cauldron-loading">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="drop-shadow-[0_0_20px_#c9a84c66]"
        >
          {/* Cauldron body */}
          <ellipse cx="60" cy="90" rx="45" ry="12" fill="#2a1a0a" />
          <path
            d="M20 55 Q20 95 60 95 Q100 95 100 55 Z"
            fill="#3d2a1a"
            stroke="#c9a84c"
            strokeWidth="1.5"
          />
          <ellipse
            cx="60"
            cy="55"
            rx="40"
            ry="12"
            fill="#4a3520"
            stroke="#c9a84c"
            strokeWidth="1.5"
          />
          {/* Green potion surface */}
          <ellipse cx="60" cy="57" rx="35" ry="9" fill="#1a4a2a" opacity="0.8">
            <animate
              attributeName="ry"
              values="9;10;9"
              dur="2s"
              repeatCount="indefinite"
            />
          </ellipse>
          {/* Glow */}
          <ellipse cx="60" cy="57" rx="25" ry="6" fill="#2a8a4a" opacity="0.4">
            <animate
              attributeName="opacity"
              values="0.4;0.7;0.4"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </ellipse>
          {/* Handles */}
          <path
            d="M18 60 Q5 60 10 75 Q15 85 22 80"
            fill="none"
            stroke="#c9a84c"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M102 60 Q115 60 110 75 Q105 85 98 80"
            fill="none"
            stroke="#c9a84c"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        {/* Bubbles */}
        {bubbles.map((b) => (
          <div
            key={b.id}
            className="absolute bubble"
            style={{
              left: `${b.left}%`,
              bottom: "55%",
              width: `${b.size}px`,
              height: `${b.size}px`,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 30% 30%, #4ade8066, #16a34a33)",
              border: "1px solid #4ade8044",
              animationDelay: `${b.delay}s`,
              animationDuration: `${1 + Math.random()}s`,
            }}
          />
        ))}

        {/* Steam/smoke */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute w-8 h-8 rounded-full opacity-30"
              style={{
                background:
                  "radial-gradient(circle, #4ade8044, transparent)",
                animation: `float ${3 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.8}s`,
                left: `${(i - 1) * 20}px`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center">
        <p
          className="text-gold text-xl transition-all duration-500"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {SPELL_MESSAGES[messageIndex]}
        </p>
        <div className="flex justify-center gap-1 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gold"
              style={{
                animation: "pulse-glow 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
