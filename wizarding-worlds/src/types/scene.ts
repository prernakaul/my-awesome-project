export interface SceneMaterial {
  color: string;
  roughness?: number;
  metalness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  opacity?: number;
  transparent?: boolean;
}

export interface SceneObject {
  type:
    | "cauldron"
    | "table"
    | "shelf"
    | "bottle"
    | "candle"
    | "torch"
    | "book"
    | "stool"
    | "chair"
    | "barrel"
    | "crate"
    | "pillar"
    | "arch"
    | "chest"
    | "rug"
    | "mirror"
    | "stairs"
    | "fountain"
    | "statue"
    | "banner"
    | "cobweb"
    | "box"
    | "cylinder"
    | "sphere";
  label?: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  material: SceneMaterial;
}

export interface SceneLight {
  type: "point" | "spot";
  position: [number, number, number];
  color: string;
  intensity: number;
  distance?: number;
  flickering?: boolean;
}

export interface SceneParticles {
  type: "fire" | "smoke" | "dust" | "sparks" | "magic" | "fireflies";
  position: [number, number, number];
  color: string;
  count: number;
  spread: [number, number, number];
}

export interface SceneDefinition {
  room: {
    width: number;
    depth: number;
    height: number;
    wallMaterial: SceneMaterial;
    floorMaterial: SceneMaterial;
    ceilingMaterial: SceneMaterial;
  };
  objects: SceneObject[];
  lights: SceneLight[];
  particles: SceneParticles[];
  fog: {
    color: string;
    near: number;
    far: number;
  };
  ambientLight: {
    color: string;
    intensity: number;
  };
  playerStart: [number, number, number];
}
