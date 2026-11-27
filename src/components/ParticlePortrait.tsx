import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import "./styles/ParticlePortrait.css";

// ==========================================
// TUNING CONSTANTS
// ==========================================
const IMAGE_PATH = "/images/me.png";
const DESKTOP_PARTICLE_COUNT = 30000;
const MOBILE_PARTICLE_COUNT = 10000;
const ASSEMBLE_DURATION = 2.8; // Seconds for particles to assemble into photo
const POINT_SIZE = 4.2; // Point sprite size in pixels

const ParticlePortrait: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Mouse & interaction state
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });
  const scatterRef = useRef<{ active: boolean; factor: number }>({ active: false, factor: 0 });

  // Handle scatter on user click/tap
  const handleTriggerScatter = useCallback(() => {
    scatterRef.current.active = true;
    scatterRef.current.factor = 1.0;
  }, []);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setPrefersReducedMotion(true);
      return;
    }

    // Check WebGL availability
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isDisposed = false;

    // Determine target particle budget
    const isMobile = window.innerWidth <= 768;
    const targetParticleCount = isMobile ? MOBILE_PARTICLE_COUNT : DESKTOP_PARTICLE_COUNT;

    // Load user image and sample visible pixels
    const img = new Image();
    img.src = IMAGE_PATH;
    img.crossOrigin = "anonymous";

    img.onload = () => {
      if (isDisposed) return;

      // Sample image pixels onto off-screen canvas
      const sampleCanvas = document.createElement("canvas");
      const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
      if (!sampleCtx) return;

      // Aspect ratio preservation
      const imgAspect = img.width / img.height;
      let sampleWidth = isMobile ? 120 : 190;
      let sampleHeight = Math.round(sampleWidth / imgAspect);

      sampleCanvas.width = sampleWidth;
      sampleCanvas.height = sampleHeight;
      sampleCtx.drawImage(img, 0, 0, sampleWidth, sampleHeight);

      const imageData = sampleCtx.getImageData(0, 0, sampleWidth, sampleHeight);
      const data = imageData.data;

      // Collect qualified visible pixels
      const candidatePixels: {
        x: number;
        y: number;
        r: number;
        g: number;
        b: number;
        brightness: number;
      }[] = [];

      for (let y = 0; y < sampleHeight; y++) {
        for (let x = 0; x < sampleWidth; x++) {
          const index = (y * sampleWidth + x) * 4;
          const a = data[index + 3];
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];

          // Skip transparent or near-white background pixels
          if (a < 30) continue;
          if (r > 245 && g > 245 && b > 245 && a > 200) continue;

          // Normalized coordinates centered at origin: x in [-aspect, aspect], y in [-1, 1]
          const normX = ((x / sampleWidth) - 0.5) * 2 * (sampleWidth / sampleHeight);
          const normY = (0.5 - (y / sampleHeight)) * 2;
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0;

          candidatePixels.push({
            x: normX,
            y: normY,
            r: r / 255,
            g: g / 255,
            b: b / 255,
            brightness,
          });
        }
      }

      if (candidatePixels.length === 0) return;

      // Stride or subsample to match target particle count
      const step = Math.max(1, candidatePixels.length / targetParticleCount);
      const chosenPixels: typeof candidatePixels = [];
      for (let i = 0; i < candidatePixels.length; i += step) {
        chosenPixels.push(candidatePixels[Math.floor(i)]);
      }

      const totalParticles = chosenPixels.length;

      // Three.js Scene Setup
      const width = container.clientWidth || 450;
      const height = container.clientHeight || 550;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 3.4);

      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current || undefined,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // BufferGeometry Attributes
      const currentPositions = new Float32Array(totalParticles * 3);
      const targetPositions = new Float32Array(totalParticles * 3);
      const originPositions = new Float32Array(totalParticles * 3);
      const colors = new Float32Array(totalParticles * 3);
      const delays = new Float32Array(totalParticles);
      const randomSeeds = new Float32Array(totalParticles * 3);

      for (let i = 0; i < totalParticles; i++) {
        const p = chosenPixels[i];

        // Final target position (z derived from brightness for subtle 3D facial relief)
        const targetZ = (p.brightness - 0.5) * 0.22;
        targetPositions[i * 3 + 0] = p.x * 1.05;
        targetPositions[i * 3 + 1] = p.y * 1.05 - 0.05; // slight center balance
        targetPositions[i * 3 + 2] = targetZ;

        // Scattered initial positions in a 3D sphere cloud around the hero
        const radius = 2.2 + Math.random() * 2.0;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        const initX = radius * Math.sin(phi) * Math.cos(theta);
        const initY = radius * Math.sin(phi) * Math.sin(theta);
        const initZ = radius * Math.cos(phi) * 1.5;

        originPositions[i * 3 + 0] = initX;
        originPositions[i * 3 + 1] = initY;
        originPositions[i * 3 + 2] = initZ;

        currentPositions[i * 3 + 0] = initX;
        currentPositions[i * 3 + 1] = initY;
        currentPositions[i * 3 + 2] = initZ;

        // Real portrait colors with subtle purple ambiance boost
        colors[i * 3 + 0] = p.r;
        colors[i * 3 + 1] = p.g;
        colors[i * 3 + 2] = p.b;

        // Staggered flight delays between 0.0s and 0.9s
        delays[i] = Math.random() * 0.9;

        // Random seeds for idle shimmer motion
        randomSeeds[i * 3 + 0] = Math.random() * 100.0;
        randomSeeds[i * 3 + 1] = Math.random() * 100.0;
        randomSeeds[i * 3 + 2] = Math.random() * 100.0;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(currentPositions, 3));
      geometry.setAttribute("aTarget", new THREE.BufferAttribute(targetPositions, 3));
      geometry.setAttribute("aOrigin", new THREE.BufferAttribute(originPositions, 3));
      geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("aDelay", new THREE.BufferAttribute(delays, 1));
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(randomSeeds, 3));

      // Custom GPU ShaderMaterial
      const customShaderMaterial = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
        uniforms: {
          uTime: { value: 0.0 },
          uProgress: { value: 0.0 },
          uAssembleDuration: { value: ASSEMBLE_DURATION },
          uPointSize: { value: POINT_SIZE * Math.min(window.devicePixelRatio, 2) },
          uScatterFactor: { value: 0.0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
        },
        vertexShader: `
          uniform float uTime;
          uniform float uProgress;
          uniform float uAssembleDuration;
          uniform float uPointSize;
          uniform float uScatterFactor;
          uniform vec2 uMouse;

          attribute vec3 aTarget;
          attribute vec3 aOrigin;
          attribute vec3 aColor;
          attribute float aDelay;
          attribute vec3 aSeed;

          varying vec3 vColor;
          varying float vAlpha;

          // Cubic ease-out
          float easeOutCubic(float t) {
            return 1.0 - pow(1.0 - t, 3.0);
          }

          void main() {
            vColor = aColor;

            // Staggered arrival progress
            float effectiveDuration = uAssembleDuration * 0.7;
            float particleProgress = clamp((uProgress - aDelay) / effectiveDuration, 0.0, 1.0);
            float t = easeOutCubic(particleProgress);

            // Interpolate position from scatter to assembled face
            vec3 assembledPos = aTarget;

            // Subtle idle shimmer & breath when assembled
            if (t > 0.95) {
              float shimmer = sin(uTime * 2.0 + aSeed.x) * 0.008;
              assembledPos.z += shimmer;
              assembledPos.x += cos(uTime * 1.5 + aSeed.y) * 0.004;
              assembledPos.y += sin(uTime * 1.8 + aSeed.z) * 0.004;
            }

            vec3 pos = mix(aOrigin, assembledPos, t);

            // Interactive scatter blast upon click
            if (uScatterFactor > 0.001) {
              vec3 scatterDirection = normalize(pos - vec3(uMouse, 0.2));
              pos += scatterDirection * (sin(uScatterFactor * 3.1415) * 0.75 + aSeed.x * 0.002);
            }

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;

            // Size attenuation
            gl_PointSize = (uPointSize / -mvPosition.z) * (0.85 + 0.3 * t);
            vAlpha = min(1.0, 0.3 + 0.7 * t);
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;

          void main() {
            // Render smooth circular antialiased particles
            vec2 coord = gl_PointCoord - vec2(0.5);
            float dist = length(coord);
            if (dist > 0.5) discard;

            // Soft radial edge
            float softEdge = smoothstep(0.5, 0.35, dist);
            gl_FragColor = vec4(vColor, vAlpha * softEdge);
          }
        `,
      });

      const particlePoints = new THREE.Points(geometry, customShaderMaterial);
      scene.add(particlePoints);

      setIsLoaded(true);

      // Animation & Clock
      let startTime: number | null = null;
      let isVisible = true;

      // Mouse tracking for parallax tilt
      const handleMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        mouseRef.current.targetX = ((e.clientX / innerWidth) - 0.5) * 2;
        mouseRef.current.targetY = -((e.clientY / innerHeight) - 0.5) * 2;
      };
      window.addEventListener("mousemove", handleMouseMove);

      // Handle visibilitychange to save power when tab is backgrounded
      const handleVisibilityChange = () => {
        isVisible = !document.hidden;
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Resize handler
      const handleResize = () => {
        if (!container) return;
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };
      window.addEventListener("resize", handleResize);

      // Render Loop
      const render = (time: number) => {
        if (isDisposed) return;
        animationFrameId = requestAnimationFrame(render);

        if (!isVisible) return;

        if (startTime === null) startTime = time;
        const elapsed = (time - startTime) / 1000.0;

        // Smooth mouse lerp
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

        // Parallax cloud tilt
        particlePoints.rotation.y = mouseRef.current.x * 0.18;
        particlePoints.rotation.x = -mouseRef.current.y * 0.12;

        // Update uniforms
        customShaderMaterial.uniforms.uTime.value = elapsed;
        customShaderMaterial.uniforms.uProgress.value = elapsed;
        customShaderMaterial.uniforms.uMouse.value.set(
          mouseRef.current.x * 0.5,
          mouseRef.current.y * 0.5
        );

        // Scatter decay
        if (scatterRef.current.active) {
          scatterRef.current.factor -= 0.035;
          if (scatterRef.current.factor <= 0) {
            scatterRef.current.factor = 0;
            scatterRef.current.active = false;
          }
        }
        customShaderMaterial.uniforms.uScatterFactor.value = scatterRef.current.factor;

        renderer.render(scene, camera);
      };

      animationFrameId = requestAnimationFrame(render);

      // Cleanup
      return () => {
        isDisposed = true;
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("visibilitychange", handleVisibilityChange);

        geometry.dispose();
        customShaderMaterial.dispose();
        renderer.dispose();
      };
    };

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="particle-portrait-container"
      ref={containerRef}
      onClick={handleTriggerScatter}
      title="Click to interact with 3D particles"
    >
      {/* Background purple aura matching portfolio theme */}
      <div className="particle-halo-glow" />

      {/* Floating editorial roles tags */}
      <div className="particle-badge particle-badge-left">
        <span className="particle-badge-text">Software Developer</span>
        <span className="particle-badge-star">✦</span>
      </div>

      <div className="particle-badge particle-badge-right">
        <span className="particle-badge-text">Competitive Programmer</span>
        <span className="particle-badge-star">✦</span>
      </div>

      {/* Fallback for reduced motion or no WebGL */}
      {prefersReducedMotion || !hasWebGL ? (
        <img
          src={IMAGE_PATH}
          alt="Photo of Debojit Dey"
          className="particle-static-fallback"
        />
      ) : (
        <>
          {/* Static placeholder before points compile */}
          {!isLoaded && (
            <img
              src={IMAGE_PATH}
              alt="Photo of Debojit Dey"
              className="particle-static-placeholder"
            />
          )}
          <canvas
            ref={canvasRef}
            className={`particle-canvas ${isLoaded ? "loaded" : ""}`}
            aria-label="3D Particle Photo of Debojit Dey"
            role="img"
          />
        </>
      )}

      {/* Subtle bottom fade into the dark background */}
      <div className="particle-bottom-fade" />
    </div>
  );
};

export default ParticlePortrait;
