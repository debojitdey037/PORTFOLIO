import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

const textureLoader = new THREE.TextureLoader();

const makeLabelTexture = (text: string, color: string) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  let size = 130;
  ctx.font = `bold ${size}px Arial, Helvetica, sans-serif`;
  const maxWidth = 400;
  const width = ctx.measureText(text).width;
  if (width > maxWidth) {
    size = Math.floor((size * maxWidth) / width);
    ctx.font = `bold ${size}px Arial, Helvetica, sans-serif`;
  }

  [256, 768].forEach((x) => ctx.fillText(text, x, 256));

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
};

const loadImageTexture = (url: string) => {
  const texture = textureLoader.load(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
};

const techItems: { image?: string; label?: string; color?: string }[] = [
  { label: "C++", color: "#00599C" },
  { image: "/images/javascript.webp" },
  { label: "HTML", color: "#E34F26" },
  { label: "CSS", color: "#1572B6" },
  { label: "Python", color: "#3776AB" },
  { image: "/images/express.webp" },
  { image: "/images/node2.webp" },
  { image: "/images/react2.webp" },
  { label: "NumPy", color: "#4D77CF" },
  { label: "pandas", color: "#150458" },
  { label: "Matplotlib", color: "#11557C" },
  { label: "Seaborn", color: "#2A7BA6" },
  { image: "/images/mongo.webp" },
];

const textures = techItems.map((item) =>
  item.image
    ? loadImageTexture(item.image)
    : makeLabelTexture(item.label!, item.color!)
);

const sphereGeometry = new THREE.SphereGeometry(1, 48, 48);

const BALLS_PER_LOGO = 2;
const sizes = [0.8, 1, 0.9, 1, 1.1];
const spheres = [...Array(textures.length * BALLS_PER_LOGO)].map((_, i) => ({
  scale: sizes[Math.floor(Math.random() * sizes.length)],
  materialIndex: i % textures.length, 
  position: [
    THREE.MathUtils.randFloatSpread(20),
    THREE.MathUtils.randFloatSpread(20) - 25,
    THREE.MathUtils.randFloatSpread(20) - 10,
  ] as [number, number, number],
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  position: [number, number, number];
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  position,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={position}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { rootMargin: "200px" }
    );
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  const materials = useMemo(() => {
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          color: "#ffffff",
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.35,
          metalness: 0.15,
          roughness: 0.35,
          clearcoat: 1,
          clearcoatRoughness: 0.15,
        })
    );
  }, []);

  return (
    <div className="techstack" ref={containerRef}>
      <h2> My Techstack</h2>

      <Canvas
        shadows
        dpr={[1, 1.5]}
        frameloop={isActive ? "always" : "never"}
        gl={{
          alpha: true,
          stencil: false,
          depth: false,
          antialias: false,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        className="tech-canvas"
      >
        <ambientLight intensity={1} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        <Physics gravity={[0, 0, 0]}>
          <Pointer isActive={isActive} />
          {spheres.map((props, i) => (
            <SphereGeo
              key={i}
              scale={props.scale}
              position={props.position}
              material={materials[props.materialIndex]}
              isActive={isActive}
            />
          ))}
        </Physics>
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.8}
          environmentRotation={[0, 4, 2]}
        />
        <EffectComposer enableNormalPass={false} multisampling={0}>
          <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default TechStack;