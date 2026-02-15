"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";

function PanoramaSphere({ imageUrl }: { imageUrl: string }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    loader.load(
      imageUrl,
      (tex) => {
        tex.mapping = THREE.EquirectangularReflectionMapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        setTexture(tex);
      },
      undefined,
      (err) => {
        console.error("Failed to load texture:", err);
      }
    );

    return () => {
      if (texture) texture.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  if (!texture) return null;

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function CameraController() {
  const { camera, gl } = useThree();
  const isPointerDown = useRef(false);
  const previousPointer = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const autoRotate = useRef(true);

  useFrame(() => {
    if (autoRotate.current && !isPointerDown.current) {
      rotation.current.y += 0.001;
    }

    if (!isPointerDown.current) {
      velocity.current.x *= 0.95;
      velocity.current.y *= 0.95;
      rotation.current.x += velocity.current.x;
      rotation.current.y += velocity.current.y;
    }

    rotation.current.x = Math.max(
      -Math.PI / 2.5,
      Math.min(Math.PI / 2.5, rotation.current.x)
    );

    camera.rotation.order = "YXZ";
    camera.rotation.y = rotation.current.y;
    camera.rotation.x = rotation.current.x;
  });

  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown.current = true;
      autoRotate.current = false;
      previousPointer.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDown.current) return;
      const deltaX = e.clientX - previousPointer.current.x;
      const deltaY = e.clientY - previousPointer.current.y;

      velocity.current.x = -deltaY * 0.003;
      velocity.current.y = -deltaX * 0.003;

      rotation.current.x += velocity.current.x;
      rotation.current.y += velocity.current.y;

      previousPointer.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isPointerDown.current = false;
      setTimeout(() => {
        if (!isPointerDown.current) autoRotate.current = true;
      }, 5000);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const cam = camera as THREE.PerspectiveCamera;
      cam.fov = Math.max(30, Math.min(90, cam.fov + e.deltaY * 0.05));
      cam.updateProjectionMatrix();
    };

    // Touch support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isPointerDown.current = true;
        autoRotate.current = false;
        previousPointer.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isPointerDown.current || e.touches.length !== 1) return;
      e.preventDefault();
      const deltaX = e.touches[0].clientX - previousPointer.current.x;
      const deltaY = e.touches[0].clientY - previousPointer.current.y;

      velocity.current.x = -deltaY * 0.003;
      velocity.current.y = -deltaX * 0.003;

      rotation.current.x += velocity.current.x;
      rotation.current.y += velocity.current.y;

      previousPointer.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const onTouchEnd = () => {
      isPointerDown.current = false;
      setTimeout(() => {
        if (!isPointerDown.current) autoRotate.current = true;
      }, 5000);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [camera, gl]);

  return null;
}

interface SkyboxViewerProps {
  imageUrl: string;
  onClose: () => void;
}

export default function SkyboxViewer({ imageUrl, onClose }: SkyboxViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Pre-load the image to show loading state
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setLoaded(true);
    img.src = imageUrl;
  }, [imageUrl]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden border border-gold/30"
      style={{ height: isFullscreen ? "100vh" : "70vh" }}
    >
      {/* Loading overlay */}
      {!loaded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background">
          <p
            className="text-gold text-lg animate-pulse"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Loading your world...
          </p>
        </div>
      )}

      {/* Controls overlay */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto flex gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-black/60 backdrop-blur-sm text-gold border border-gold/30 hover:bg-gold/20 transition-all text-sm"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            New World
          </button>
          <button
            onClick={toggleFullscreen}
            className="px-4 py-2 rounded-lg bg-black/60 backdrop-blur-sm text-gold border border-gold/30 hover:bg-gold/20 transition-all text-sm"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        </div>
      </div>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div
          className="px-4 py-2 rounded-lg bg-black/60 backdrop-blur-sm text-gold/70 text-sm text-center"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Drag to look around &bull; Scroll to zoom
        </div>
      </div>

      {/* Three.js Canvas */}
      <Canvas
        camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 0.1] }}
        style={{ background: "#0a0a12" }}
      >
        <CameraController />
        <PanoramaSphere imageUrl={imageUrl} />
      </Canvas>
    </div>
  );
}
