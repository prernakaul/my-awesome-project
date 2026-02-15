"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import * as THREE from "three";

// ---- Panoramic Sphere ----

function PanoramaSphere({ imageUrl }: { imageUrl: string }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
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
      (err) => console.error("Failed to load panorama:", err)
    );

    return () => {
      texture?.dispose();
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

// ---- Atmospheric Particles ----

function MagicDust() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 300;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 40;
      pos[i3 + 1] = (Math.random() - 0.5) * 20;
      pos[i3 + 2] = (Math.random() - 0.5) * 40;
      vel[i3] = (Math.random() - 0.5) * 0.005;
      vel[i3 + 1] = Math.random() * 0.008 + 0.002;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    return [pos, vel];
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    const posAttr = particlesRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3] += velocities[i3];
      arr[i3 + 1] += velocities[i3 + 1];
      arr[i3 + 2] += velocities[i3 + 2];

      // Reset when too high
      if (arr[i3 + 1] > 15) {
        arr[i3] = (Math.random() - 0.5) * 40;
        arr[i3 + 1] = -10;
        arr[i3 + 2] = (Math.random() - 0.5) * 40;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#f0d77b"
        size={0.08}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ---- Firefly Lights ----

function Fireflies() {
  const count = 20;
  const meshesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 30
      ),
      speed: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
      radius: Math.random() * 2 + 1,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!meshesRef.current) return;
    const t = clock.elapsedTime;

    data.forEach((d, i) => {
      dummy.position.set(
        d.position.x + Math.sin(t * d.speed + d.phase) * d.radius,
        d.position.y + Math.cos(t * d.speed * 0.7 + d.phase) * 1.5,
        d.position.z + Math.cos(t * d.speed + d.phase) * d.radius
      );
      const scale = 0.15 + 0.1 * Math.sin(t * 3 + d.phase);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshesRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshesRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.3, 8, 8]} />
      <meshBasicMaterial
        color="#f0d77b"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

// ---- Ambient Light Shafts (subtle glow sprites) ----

function LightShafts() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.03 + 0.02 * Math.sin(t * 0.3 + i * 1.5);
    });
  });

  const shafts = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        position: [
          Math.sin((i / 4) * Math.PI * 2) * 15,
          5,
          Math.cos((i / 4) * Math.PI * 2) * 15,
        ] as [number, number, number],
        rotation: [0, (i / 4) * Math.PI * 2, 0] as [number, number, number],
        scale: [8, 20, 1] as [number, number, number],
      })),
    []
  );

  return (
    <group ref={groupRef}>
      {shafts.map((s, i) => (
        <mesh key={i} position={s.position} rotation={s.rotation} scale={s.scale}>
          <planeGeometry />
          <meshBasicMaterial
            color="#f0d77b"
            transparent
            opacity={0.03}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ---- Camera Controller ----

function CameraController() {
  const { camera, gl } = useThree();
  const isPointerDown = useRef(false);
  const previousPointer = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const autoRotate = useRef(true);
  const autoRotateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFrame(() => {
    // Gentle auto-rotate
    if (autoRotate.current && !isPointerDown.current) {
      rotation.current.y += 0.0005;
    }

    // Momentum
    if (!isPointerDown.current) {
      velocity.current.x *= 0.95;
      velocity.current.y *= 0.95;
      rotation.current.x += velocity.current.x;
      rotation.current.y += velocity.current.y;
    }

    // Clamp vertical
    rotation.current.x = Math.max(
      -Math.PI / 2.2,
      Math.min(Math.PI / 2.2, rotation.current.x)
    );

    camera.rotation.order = "YXZ";
    camera.rotation.y = rotation.current.y;
    camera.rotation.x = rotation.current.x;
  });

  useEffect(() => {
    const canvas = gl.domElement;

    const stopAutoRotate = () => {
      autoRotate.current = false;
      if (autoRotateTimer.current) clearTimeout(autoRotateTimer.current);
      autoRotateTimer.current = setTimeout(() => {
        if (!isPointerDown.current) autoRotate.current = true;
      }, 8000);
    };

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown.current = true;
      stopAutoRotate();
      previousPointer.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDown.current) return;
      const dx = e.clientX - previousPointer.current.x;
      const dy = e.clientY - previousPointer.current.y;

      velocity.current.x = -dy * 0.003;
      velocity.current.y = -dx * 0.003;

      rotation.current.x += velocity.current.x;
      rotation.current.y += velocity.current.y;

      previousPointer.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isPointerDown.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const cam = camera as THREE.PerspectiveCamera;
      cam.fov = Math.max(30, Math.min(100, cam.fov + e.deltaY * 0.05));
      cam.updateProjectionMatrix();
    };

    // Touch
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isPointerDown.current = true;
        stopAutoRotate();
        previousPointer.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isPointerDown.current || e.touches.length !== 1) return;
      e.preventDefault();
      const dx = e.touches[0].clientX - previousPointer.current.x;
      const dy = e.touches[0].clientY - previousPointer.current.y;

      velocity.current.x = -dy * 0.003;
      velocity.current.y = -dx * 0.003;

      rotation.current.x += velocity.current.x;
      rotation.current.y += velocity.current.y;

      previousPointer.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const onTouchEnd = () => {
      isPointerDown.current = false;
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
      if (autoRotateTimer.current) clearTimeout(autoRotateTimer.current);
    };
  }, [camera, gl]);

  return null;
}

// ---- Vignette Overlay ----

function Vignette() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        background:
          "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
      }}
    />
  );
}

// ---- Main Component ----

interface ImmersiveViewerProps {
  imageUrl: string;
  onExit: () => void;
}

export default function ImmersiveViewer({
  imageUrl,
  onExit,
}: ImmersiveViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showHint, setShowHint] = useState(true);
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
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Pre-load image
  useEffect(() => {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.src = imageUrl;
  }, [imageUrl]);

  // Hide hint after a few seconds
  useEffect(() => {
    if (loaded) {
      const timer = setTimeout(() => setShowHint(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [loaded]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden"
    >
      {/* Loading */}
      {!loaded && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black">
          <div className="cauldron-loading mb-6">
            <svg width="60" height="60" viewBox="0 0 100 80" fill="none">
              <ellipse cx="50" cy="65" rx="35" ry="12" fill="#c9a84c" opacity="0.3" />
              <path
                d="M20 35 Q20 65 50 65 Q80 65 80 35"
                stroke="#c9a84c"
                strokeWidth="3"
                fill="none"
              />
              <path
                d="M20 35 L15 30 M80 35 L85 30"
                stroke="#c9a84c"
                strokeWidth="2.5"
              />
              <ellipse cx="50" cy="35" rx="30" ry="8" fill="#1a0a2e" stroke="#c9a84c" strokeWidth="2" />
            </svg>
          </div>
          <p
            className="text-gold text-lg animate-pulse"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Conjuring your world...
          </p>
        </div>
      )}

      {/* Three.js Canvas */}
      {loaded && (
        <Canvas
          camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 0.1] }}
          style={{ background: "#000" }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <CameraController />
          <PanoramaSphere imageUrl={imageUrl} />
          <MagicDust />
          <Fireflies />
          <LightShafts />
          <fog attach="fog" args={["#0a0a12", 80, 400]} />
        </Canvas>
      )}

      {/* Vignette */}
      {loaded && <Vignette />}

      {/* Top controls */}
      {loaded && (
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
          <div className="flex gap-2">
            <button
              onClick={onExit}
              className="px-4 py-2 rounded-lg bg-black/60 backdrop-blur-sm text-gold border border-gold/30 hover:bg-gold/20 hover:border-gold/60 transition-all text-sm"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              New World
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-4 py-2 rounded-lg bg-black/60 backdrop-blur-sm text-gold border border-gold/30 hover:bg-gold/20 hover:border-gold/60 transition-all text-sm"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>
          </div>
        </div>
      )}

      {/* Bottom hint */}
      {loaded && showHint && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div
            className="px-6 py-3 rounded-xl bg-black/60 backdrop-blur-sm text-gold/70 text-sm text-center transition-opacity duration-1000"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Drag to look around &bull; Scroll to zoom &bull; Tap Fullscreen for best experience
          </div>
        </div>
      )}
    </div>
  );
}
