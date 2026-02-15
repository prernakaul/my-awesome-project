"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import type { SceneDefinition, SceneObject, SceneLight, SceneParticles } from "@/types/scene";

// ---- Object Builders ----

function buildMaterial(mat: SceneObject["material"]): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: mat.color,
    roughness: mat.roughness ?? 0.8,
    metalness: mat.metalness ?? 0.1,
    emissive: mat.emissive ? new THREE.Color(mat.emissive) : undefined,
    emissiveIntensity: mat.emissiveIntensity ?? 0,
    transparent: mat.transparent ?? false,
    opacity: mat.opacity ?? 1,
  });
}

function buildCauldron(obj: SceneObject): THREE.Group {
  const group = new THREE.Group();
  const mat = buildMaterial(obj.material);

  // Bowl
  const bowl = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    mat
  );
  bowl.rotation.x = Math.PI;
  bowl.position.y = 0.5;
  group.add(bowl);

  // Rim
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.05, 8, 16),
    mat
  );
  rim.position.y = 0.5;
  rim.rotation.x = Math.PI / 2;
  group.add(rim);

  // Legs
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.06, 0.3, 6),
      mat
    );
    leg.position.set(Math.cos(angle) * 0.35, 0.15, Math.sin(angle) * 0.35);
    group.add(leg);
  }

  // Glowing liquid inside
  const liquid = new THREE.Mesh(
    new THREE.CircleGeometry(0.45, 16),
    new THREE.MeshStandardMaterial({
      color: obj.material.emissive || "#2a8a4a",
      emissive: new THREE.Color(obj.material.emissive || "#2a8a4a"),
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.8,
    })
  );
  liquid.rotation.x = -Math.PI / 2;
  liquid.position.y = 0.45;
  group.add(liquid);

  return group;
}

function buildTable(obj: SceneObject): THREE.Group {
  const group = new THREE.Group();
  const mat = buildMaterial(obj.material);
  const s = obj.scale || [1, 1, 1];

  // Top
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(1.2 * s[0], 0.08, 0.6 * s[2]),
    mat
  );
  top.position.y = 0.75 * s[1];
  group.add(top);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.75 * s[1], 6);
  const positions = [[-0.5, 0, -0.25], [0.5, 0, -0.25], [-0.5, 0, 0.25], [0.5, 0, 0.25]];
  positions.forEach(([x, , z]) => {
    const leg = new THREE.Mesh(legGeo, mat);
    leg.position.set(x * s[0], 0.375 * s[1], z * s[2]);
    group.add(leg);
  });

  return group;
}

function buildShelf(obj: SceneObject): THREE.Group {
  const group = new THREE.Group();
  const mat = buildMaterial(obj.material);
  const s = obj.scale || [1, 1, 1];

  for (let i = 0; i < 3; i++) {
    const plank = new THREE.Mesh(
      new THREE.BoxGeometry(1.5 * s[0], 0.04, 0.3 * s[2]),
      mat
    );
    plank.position.y = 0.4 + i * 0.5;
    group.add(plank);

    // Brackets
    for (const side of [-0.7, 0.7]) {
      const bracket = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.15, 0.25),
        mat
      );
      bracket.position.set(side * s[0], 0.33 + i * 0.5, 0);
      group.add(bracket);
    }
  }

  return group;
}

function buildBottle(obj: SceneObject): THREE.Group {
  const group = new THREE.Group();
  const mat = buildMaterial(obj.material);

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.05, 0.15, 8),
    mat
  );
  body.position.y = 0.075;
  group.add(body);

  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.03, 0.06, 8),
    mat
  );
  neck.position.y = 0.18;
  group.add(neck);

  const cork = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.02, 0.025, 8),
    new THREE.MeshStandardMaterial({ color: "#8B6914", roughness: 0.9 })
  );
  cork.position.y = 0.22;
  group.add(cork);

  return group;
}

function buildCandle(obj: SceneObject): THREE.Group {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.03, 0.15, 8),
    new THREE.MeshStandardMaterial({ color: "#f5f0dc", roughness: 0.9 })
  );
  body.position.y = 0.075;
  group.add(body);

  // Flame
  const flame = new THREE.Mesh(
    new THREE.SphereGeometry(0.015, 8, 8),
    new THREE.MeshStandardMaterial({
      color: "#ff8c00",
      emissive: new THREE.Color("#ff6600"),
      emissiveIntensity: 2,
      transparent: true,
      opacity: 0.9,
    })
  );
  flame.position.y = 0.16;
  flame.scale.y = 1.5;
  group.add(flame);

  return group;
}

function buildTorch(obj: SceneObject): THREE.Group {
  const group = new THREE.Group();
  const mat = buildMaterial(obj.material);

  // Handle
  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.025, 0.5, 6),
    mat
  );
  handle.position.y = 0.25;
  group.add(handle);

  // Bracket
  const bracket = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.08, 0.04),
    mat
  );
  bracket.position.set(0, 0.2, -0.05);
  group.add(bracket);

  // Fire
  const fire = new THREE.Mesh(
    new THREE.ConeGeometry(0.06, 0.15, 8),
    new THREE.MeshStandardMaterial({
      color: "#ff4500",
      emissive: new THREE.Color("#ff6600"),
      emissiveIntensity: 3,
      transparent: true,
      opacity: 0.85,
    })
  );
  fire.position.y = 0.55;
  group.add(fire);

  return group;
}

function buildBook(obj: SceneObject): THREE.Group {
  const group = new THREE.Group();
  const mat = buildMaterial(obj.material);

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.04, 0.28),
    mat
  );
  body.position.y = 0.02;
  group.add(body);

  // Pages
  const pages = new THREE.Mesh(
    new THREE.BoxGeometry(0.17, 0.03, 0.26),
    new THREE.MeshStandardMaterial({ color: "#f5ecd0", roughness: 0.95 })
  );
  pages.position.y = 0.02;
  group.add(pages);

  return group;
}

function buildStool(obj: SceneObject): THREE.Group {
  const group = new THREE.Group();
  const mat = buildMaterial(obj.material);

  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 12), mat);
  seat.position.y = 0.5;
  group.add(seat);

  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.5, 6), mat);
    leg.position.set(Math.cos(a) * 0.15, 0.25, Math.sin(a) * 0.15);
    group.add(leg);
  }

  return group;
}

function buildBarrel(obj: SceneObject): THREE.Group {
  const group = new THREE.Group();
  const mat = buildMaterial(obj.material);

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 0.7, 12), mat);
  body.position.y = 0.35;
  group.add(body);

  // Bands
  for (const y of [0.15, 0.55]) {
    const band = new THREE.Mesh(
      new THREE.TorusGeometry(0.28, 0.015, 6, 16),
      new THREE.MeshStandardMaterial({ color: "#555", metalness: 0.8, roughness: 0.4 })
    );
    band.position.y = y;
    band.rotation.x = Math.PI / 2;
    group.add(band);
  }

  return group;
}

function buildPillar(obj: SceneObject): THREE.Group {
  const group = new THREE.Group();
  const mat = buildMaterial(obj.material);
  const s = obj.scale || [1, 1, 1];

  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2 * s[0], 0.25 * s[0], 3 * s[1], 12),
    mat
  );
  shaft.position.y = 1.5 * s[1];
  group.add(shaft);

  // Base
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35 * s[0], 0.35 * s[0], 0.15, 12),
    mat
  );
  base.position.y = 0.075;
  group.add(base);

  return group;
}

function buildChest(obj: SceneObject): THREE.Group {
  const group = new THREE.Group();
  const mat = buildMaterial(obj.material);

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 0.35), mat);
  body.position.y = 0.175;
  group.add(body);

  // Lid (curved top)
  const lid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.6, 8, 1, false, 0, Math.PI),
    mat
  );
  lid.rotation.z = Math.PI / 2;
  lid.position.y = 0.35;
  group.add(lid);

  // Lock
  const lock = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.06, 0.02),
    new THREE.MeshStandardMaterial({ color: "#b8860b", metalness: 0.9, roughness: 0.3 })
  );
  lock.position.set(0, 0.25, 0.18);
  group.add(lock);

  return group;
}

function buildGenericShape(obj: SceneObject): THREE.Mesh {
  const mat = buildMaterial(obj.material);
  const s = obj.scale || [1, 1, 1];

  let geo: THREE.BufferGeometry;
  switch (obj.type) {
    case "cylinder":
      geo = new THREE.CylinderGeometry(0.3 * s[0], 0.3 * s[0], 1 * s[1], 12);
      break;
    case "sphere":
      geo = new THREE.SphereGeometry(0.3 * Math.max(s[0], s[1], s[2]), 16, 16);
      break;
    default: // box and everything else
      geo = new THREE.BoxGeometry(s[0], s[1], s[2]);
      break;
  }

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = (s[1] || 1) / 2;
  return mesh;
}

function buildObject(obj: SceneObject): THREE.Object3D {
  let object: THREE.Object3D;

  switch (obj.type) {
    case "cauldron": object = buildCauldron(obj); break;
    case "table": object = buildTable(obj); break;
    case "shelf": object = buildShelf(obj); break;
    case "bottle": object = buildBottle(obj); break;
    case "candle": object = buildCandle(obj); break;
    case "torch": object = buildTorch(obj); break;
    case "book": object = buildBook(obj); break;
    case "stool": case "chair": object = buildStool(obj); break;
    case "barrel": case "crate": object = buildBarrel(obj); break;
    case "pillar": case "arch": object = buildPillar(obj); break;
    case "chest": object = buildChest(obj); break;
    case "rug":
      object = new THREE.Mesh(
        new THREE.PlaneGeometry(
          (obj.scale?.[0] || 1) * 2,
          (obj.scale?.[2] || 1) * 2
        ),
        buildMaterial(obj.material)
      );
      (object as THREE.Mesh).rotation.x = -Math.PI / 2;
      object.position.y = 0.01;
      break;
    case "banner":
      object = new THREE.Mesh(
        new THREE.PlaneGeometry(0.6 * (obj.scale?.[0] || 1), 1.5 * (obj.scale?.[1] || 1)),
        buildMaterial({ ...obj.material, transparent: true, opacity: 0.9 })
      );
      break;
    case "mirror":
      object = new THREE.Mesh(
        new THREE.PlaneGeometry(0.5 * (obj.scale?.[0] || 1), 0.8 * (obj.scale?.[1] || 1)),
        new THREE.MeshStandardMaterial({
          color: "#aabbcc",
          metalness: 1,
          roughness: 0.05,
        })
      );
      break;
    case "cobweb":
      object = new THREE.Mesh(
        new THREE.PlaneGeometry(0.5, 0.5),
        new THREE.MeshStandardMaterial({
          color: "#dddddd",
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide,
        })
      );
      break;
    default:
      object = buildGenericShape(obj);
  }

  object.position.set(obj.position[0], obj.position[1], obj.position[2]);
  if (obj.rotation) {
    object.rotation.set(obj.rotation[0], obj.rotation[1], obj.rotation[2]);
  }
  object.castShadow = true;
  object.receiveShadow = true;

  return object;
}

// ---- Particle System ----

class ParticleSystem {
  mesh: THREE.Points;
  velocities: Float32Array;
  basePositions: Float32Array;
  config: SceneParticles;

  constructor(config: SceneParticles) {
    this.config = config;
    const count = config.count;
    const positions = new Float32Array(count * 3);
    this.velocities = new Float32Array(count * 3);
    this.basePositions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = config.position[0] + (Math.random() - 0.5) * config.spread[0];
      positions[i3 + 1] = config.position[1] + Math.random() * config.spread[1];
      positions[i3 + 2] = config.position[2] + (Math.random() - 0.5) * config.spread[2];

      this.basePositions[i3] = positions[i3];
      this.basePositions[i3 + 1] = positions[i3 + 1];
      this.basePositions[i3 + 2] = positions[i3 + 2];

      const speed = config.type === "fire" ? 0.02 : config.type === "smoke" ? 0.005 : 0.003;
      this.velocities[i3] = (Math.random() - 0.5) * speed;
      this.velocities[i3 + 1] = Math.random() * speed * 2;
      this.velocities[i3 + 2] = (Math.random() - 0.5) * speed;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const size = config.type === "dust" ? 0.03 : config.type === "fire" ? 0.08 : 0.05;
    const mat = new THREE.PointsMaterial({
      color: config.color,
      size,
      transparent: true,
      opacity: config.type === "dust" ? 0.4 : 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.mesh = new THREE.Points(geo, mat);
  }

  update() {
    const positions = this.mesh.geometry.attributes.position.array as Float32Array;
    const count = this.config.count;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] += this.velocities[i3];
      positions[i3 + 1] += this.velocities[i3 + 1];
      positions[i3 + 2] += this.velocities[i3 + 2];

      // Reset particles that go too far
      const dy = positions[i3 + 1] - this.basePositions[i3 + 1];
      if (dy > this.config.spread[1] * 1.5) {
        positions[i3] = this.basePositions[i3] + (Math.random() - 0.5) * this.config.spread[0] * 0.5;
        positions[i3 + 1] = this.basePositions[i3 + 1];
        positions[i3 + 2] = this.basePositions[i3 + 2] + (Math.random() - 0.5) * this.config.spread[2] * 0.5;
      }
    }

    this.mesh.geometry.attributes.position.needsUpdate = true;
  }
}

// ---- Flickering Light ----

interface FlickeringLight {
  light: THREE.PointLight;
  baseIntensity: number;
  phase: number;
}

// ---- Main Component ----

interface World3DTextures {
  panorama: string | null;
  wall: string | null;
  floor: string | null;
}

interface World3DProps {
  scene: SceneDefinition;
  textures?: World3DTextures | null;
  onExit: () => void;
}

export default function World3D({ scene, textures, onExit }: World3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const cleanupRef = useRef<(() => void) | null>(null);

  const initWorld = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Clean up previous
    if (cleanupRef.current) cleanupRef.current();

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    container.appendChild(renderer.domElement);

    // Scene
    const threeScene = new THREE.Scene();

    // Fog
    if (scene.fog) {
      threeScene.fog = new THREE.Fog(scene.fog.color, scene.fog.near, scene.fog.far);
      renderer.setClearColor(scene.fog.color);
    }

    // Camera
    const camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    const start = scene.playerStart || [0, 1.7, 0];
    camera.position.set(start[0], start[1], start[2]);

    // Controls
    const controls = new PointerLockControls(camera, renderer.domElement);
    threeScene.add(controls.object);

    controls.addEventListener("lock", () => {
      setIsLocked(true);
      setShowInstructions(false);
    });
    controls.addEventListener("unlock", () => {
      setIsLocked(false);
    });

    // Ambient Light
    const ambient = new THREE.AmbientLight(
      scene.ambientLight?.color || "#111122",
      scene.ambientLight?.intensity || 0.1
    );
    threeScene.add(ambient);

    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    // Helper: load a data URL as a tiling texture
    function loadTilingTexture(dataUrl: string, repeatX: number, repeatY: number): THREE.Texture {
      const tex = textureLoader.load(dataUrl);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeatX, repeatY);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    // Panoramic Skybox (if available)
    if (textures?.panorama) {
      const skyTex = textureLoader.load(textures.panorama);
      skyTex.mapping = THREE.EquirectangularReflectionMapping;
      skyTex.colorSpace = THREE.SRGBColorSpace;
      const skyGeo = new THREE.SphereGeometry(80, 64, 64);
      const skyMat = new THREE.MeshBasicMaterial({
        map: skyTex,
        side: THREE.BackSide,
        fog: false,
      });
      const skyMesh = new THREE.Mesh(skyGeo, skyMat);
      threeScene.add(skyMesh);
    }

    // Room
    const { width, depth, height } = scene.room;
    const hw = width / 2;
    const hd = depth / 2;

    // Floor — use AI texture if available
    const floorMat = textures?.floor
      ? new THREE.MeshStandardMaterial({
          map: loadTilingTexture(textures.floor, width / 2, depth / 2),
          roughness: scene.room.floorMaterial.roughness ?? 0.8,
          metalness: scene.room.floorMaterial.metalness ?? 0.1,
        })
      : buildMaterial(scene.room.floorMaterial);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    threeScene.add(floor);

    // Ceiling — use darkened version of wall texture or plain material
    const ceilMat = buildMaterial(scene.room.ceilingMaterial);
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), ceilMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = height;
    threeScene.add(ceiling);

    // Walls — use AI texture if available
    const wallMat = textures?.wall
      ? new THREE.MeshStandardMaterial({
          map: loadTilingTexture(textures.wall, width / 3, height / 3),
          roughness: scene.room.wallMaterial.roughness ?? 0.85,
          metalness: scene.room.wallMaterial.metalness ?? 0.05,
        })
      : buildMaterial(scene.room.wallMaterial);

    const wallData: [number, number, number, number, number, number, number][] = [
      [width, height, 0, height / 2, -hd, 0, 0],      // Back
      [width, height, 0, height / 2, hd, 0, Math.PI],  // Front
      [depth, height, -hw, height / 2, 0, 0, -Math.PI / 2],  // Left
      [depth, height, hw, height / 2, 0, 0, Math.PI / 2],     // Right
    ];

    const collisionWalls: THREE.Mesh[] = [];
    wallData.forEach(([w, h, x, y, z, , ry]) => {
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat);
      wall.position.set(x, y, z);
      wall.rotation.y = ry;
      wall.receiveShadow = true;
      threeScene.add(wall);
      collisionWalls.push(wall);
    });

    // Objects
    const collisionObjects: THREE.Object3D[] = [];
    scene.objects.forEach((obj) => {
      try {
        const object = buildObject(obj);
        threeScene.add(object);
        if (!["rug", "cobweb", "banner"].includes(obj.type)) {
          collisionObjects.push(object);
        }
      } catch (e) {
        console.warn("Failed to build object:", obj.type, e);
      }
    });

    // Lights
    const flickeringLights: FlickeringLight[] = [];
    scene.lights.forEach((light: SceneLight) => {
      const pointLight = new THREE.PointLight(
        light.color,
        light.intensity,
        light.distance || 15
      );
      pointLight.position.set(light.position[0], light.position[1], light.position[2]);
      pointLight.castShadow = true;
      pointLight.shadow.mapSize.width = 512;
      pointLight.shadow.mapSize.height = 512;
      threeScene.add(pointLight);

      if (light.flickering) {
        flickeringLights.push({
          light: pointLight,
          baseIntensity: light.intensity,
          phase: Math.random() * Math.PI * 2,
        });
      }
    });

    // Particles
    const particleSystems: ParticleSystem[] = [];
    (scene.particles || []).forEach((config: SceneParticles) => {
      try {
        const ps = new ParticleSystem(config);
        threeScene.add(ps.mesh);
        particleSystems.push(ps);
      } catch (e) {
        console.warn("Failed to create particles:", e);
      }
    });

    // Movement state
    const moveState = { forward: false, backward: false, left: false, right: false };
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const clock = new THREE.Clock();
    const raycaster = new THREE.Raycaster();

    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW": case "ArrowUp": moveState.forward = true; break;
        case "KeyS": case "ArrowDown": moveState.backward = true; break;
        case "KeyA": case "ArrowLeft": moveState.left = true; break;
        case "KeyD": case "ArrowRight": moveState.right = true; break;
        case "Escape":
          if (controls.isLocked) controls.unlock();
          break;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW": case "ArrowUp": moveState.forward = false; break;
        case "KeyS": case "ArrowDown": moveState.backward = false; break;
        case "KeyA": case "ArrowLeft": moveState.left = false; break;
        case "KeyD": case "ArrowRight": moveState.right = false; break;
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    // Collision detection
    function checkCollision(pos: THREE.Vector3): boolean {
      // Wall boundaries
      const margin = 0.4;
      if (pos.x < -hw + margin || pos.x > hw - margin) return true;
      if (pos.z < -hd + margin || pos.z > hd - margin) return true;
      return false;
    }

    // Resize
    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.elapsedTime;

      if (controls.isLocked) {
        // Damping
        velocity.x -= velocity.x * 8.0 * delta;
        velocity.z -= velocity.z * 8.0 * delta;

        const speed = 4.0;
        direction.z = Number(moveState.forward) - Number(moveState.backward);
        direction.x = Number(moveState.right) - Number(moveState.left);
        direction.normalize();

        if (moveState.forward || moveState.backward) velocity.z -= direction.z * speed * delta;
        if (moveState.left || moveState.right) velocity.x -= direction.x * speed * delta;

        // Try to move, check collision
        const prevPos = camera.position.clone();
        controls.moveRight(-velocity.x * delta * 20);
        controls.moveForward(-velocity.z * delta * 20);

        if (checkCollision(camera.position)) {
          camera.position.copy(prevPos);
          velocity.set(0, 0, 0);
        }

        // Keep at eye height
        camera.position.y = 1.7;
      }

      // Flickering lights
      flickeringLights.forEach((fl) => {
        fl.phase += delta * (8 + Math.random() * 4);
        fl.light.intensity =
          fl.baseIntensity * (0.85 + 0.15 * Math.sin(fl.phase) + Math.random() * 0.1);
      });

      // Particles
      particleSystems.forEach((ps) => ps.update());

      renderer.render(threeScene, camera);
    };
    animate();

    // Cleanup
    cleanupRef.current = () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };

    // Store controls for click handler
    (container as HTMLDivElement & { __controls?: PointerLockControls }).__controls = controls;
  }, [scene, textures]);

  useEffect(() => {
    initWorld();
    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [initWorld]);

  const handleClick = useCallback(() => {
    const container = containerRef.current as HTMLDivElement & { __controls?: PointerLockControls } | null;
    if (container?.__controls && !container.__controls.isLocked) {
      container.__controls.lock();
    }
  }, []);

  return (
    <div className="relative w-full h-screen bg-black">
      <div
        ref={containerRef}
        className="w-full h-full cursor-crosshair"
        onClick={handleClick}
      />

      {/* Instructions overlay */}
      {showInstructions && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <div className="text-center max-w-md px-8">
            <h2
              className="text-3xl text-gold mb-6"
              style={{ fontFamily: "'Cinzel Decorative', cursive" }}
            >
              Enter the World
            </h2>
            <p className="text-gold/70 mb-8" style={{ fontFamily: "'Cinzel', serif" }}>
              Click anywhere to enter. Use WASD to move, mouse to look around. Press ESC to release cursor.
            </p>
            <button
              onClick={handleClick}
              className="generate-btn px-8 py-3 rounded-xl text-base tracking-wider"
            >
              Step Inside
            </button>
            <button
              onClick={onExit}
              className="block mx-auto mt-4 text-gold/40 hover:text-gold/70 transition-colors text-sm"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Back to Prompt
            </button>
          </div>
        </div>
      )}

      {/* HUD when locked */}
      {isLocked && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div
            className="px-4 py-2 rounded-lg bg-black/40 backdrop-blur-sm text-gold/50 text-xs text-center"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            WASD to move &bull; Mouse to look &bull; ESC to pause
          </div>
        </div>
      )}

      {/* Crosshair */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-1 h-1 rounded-full bg-gold/50" />
        </div>
      )}

      {/* Pause menu */}
      {!isLocked && !showInstructions && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-center">
            <p className="text-gold/70 mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
              Paused — Click to resume
            </p>
            <button
              onClick={onExit}
              className="text-gold/40 hover:text-gold/70 transition-colors text-sm"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Back to Prompt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
