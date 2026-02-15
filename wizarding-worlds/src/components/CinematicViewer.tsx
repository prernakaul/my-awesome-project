"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface CinematicViewerProps {
  videoUrl: string;
  onExit: () => void;
}

export default function CinematicViewer({ videoUrl, onExit }: CinematicViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-hide controls
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 4000);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [resetHideTimer]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    resetHideTimer();
  }, [resetHideTimer]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
    resetHideTimer();
  }, [resetHideTimer]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden cursor-pointer"
      onMouseMove={resetHideTimer}
      onClick={togglePlay}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Top controls */}
      <div
        className={`absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-start transition-opacity duration-500 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)",
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExit();
          }}
          className="px-4 py-2 rounded-lg bg-black/40 backdrop-blur-sm text-gold border border-gold/30 hover:bg-gold/20 hover:border-gold/60 transition-all text-sm"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          New World
        </button>

        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="px-4 py-2 rounded-lg bg-black/40 backdrop-blur-sm text-gold border border-gold/30 hover:bg-gold/20 hover:border-gold/60 transition-all text-sm"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className="px-4 py-2 rounded-lg bg-black/40 backdrop-blur-sm text-gold border border-gold/30 hover:bg-gold/20 hover:border-gold/60 transition-all text-sm"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        </div>
      </div>

      {/* Bottom hint */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-20 transition-opacity duration-500 pointer-events-none ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="px-6 py-3 rounded-xl bg-black/40 backdrop-blur-sm text-gold/60 text-sm text-center"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {isPlaying ? "Tap to pause" : "Tap to play"} &bull; Fullscreen for best experience
        </div>
      </div>
    </div>
  );
}
