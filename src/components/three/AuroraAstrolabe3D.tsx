import React, { Component, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

class AstrolabeErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-[300px] w-full items-center justify-center sm:h-[340px]">
          <div className="h-36 w-36 animate-pulse rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10" />
        </div>
      );
    }
    return this.props.children;
  }
}

function RendererSetup() {
  const { gl } = useThree();

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.25;
  }, [gl]);

  return null;
}

const AstrolabeAssembly = React.memo(function AstrolabeAssembly({
  dragRot,
}: {
  dragRot: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const rootRef = useRef<THREE.Group>(null);
  const globeRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const bubblesGroupRef = useRef<THREE.Group>(null);

  const materials = useMemo(() => {
    return {
      brushedGold: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D4AF37'),
        metalness: 0.82,
        roughness: 0.22,
        emissive: new THREE.Color('#5E4510'),
        emissiveIntensity: 0.35,
      }),
      paleGold: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#F3E5AB'),
        metalness: 0.78,
        roughness: 0.18,
        emissive: new THREE.Color('#8A6A1D'),
        emissiveIntensity: 0.25,
      }),
      darkEspressoCore: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2B180E'),
        metalness: 0.42,
        roughness: 0.45,
        emissive: new THREE.Color('#1A0E07'),
        emissiveIntensity: 0.4,
      }),
      globeWireframe: new THREE.MeshBasicMaterial({
        color: new THREE.Color('#F3E5AB'),
        wireframe: true,
        transparent: true,
        opacity: 0.42,
      }),
      starAccent: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FFF8DC'),
        emissive: new THREE.Color('#D4AF37'),
        emissiveIntensity: 0.9,
        roughness: 0.18,
        metalness: 0.35,
      }),
      bubbleOrb: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#F3E5AB'),
        emissive: new THREE.Color('#D4AF37'),
        emissiveIntensity: 0.55,
        transparent: true,
        opacity: 0.72,
        roughness: 0.1,
        metalness: 0.2,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(materials).forEach((mat) => mat.dispose());
    };
  }, [materials]);

  const starOffsets = useMemo(
    () => [
      [1.85, 0.35, 0.2] as const,
      [-1.75, -0.55, 0.35] as const,
      [0.2, 1.85, -0.25] as const,
      [-0.45, -1.7, -0.35] as const,
    ],
    []
  );

  const bubbleOffsets = useMemo(
    () => [
      [1.32, 0.85, 0.55, 0.08] as const,
      [-1.25, 0.95, -0.45, 0.065] as const,
      [1.1, -1.05, -0.35, 0.075] as const,
      [-1.4, -0.75, 0.45, 0.06] as const,
      [0.45, 1.4, 0.65, 0.055] as const,
      [-0.55, -1.35, -0.55, 0.07] as const,
    ],
    []
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    if (rootRef.current) {
      rootRef.current.rotation.y += dt * 0.32;
      rootRef.current.rotation.x = THREE.MathUtils.damp(
        rootRef.current.rotation.x,
        dragRot.current.x + Math.sin(t * 0.65) * 0.14,
        3.5,
        dt
      );
      rootRef.current.rotation.z = THREE.MathUtils.damp(
        rootRef.current.rotation.z,
        dragRot.current.y,
        3.5,
        dt
      );
    }

    if (globeRef.current) {
      globeRef.current.rotation.y -= dt * 0.45;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z += dt * 0.45;
    if (ring2Ref.current) ring2Ref.current.rotation.x -= dt * 0.36;
    if (bubblesGroupRef.current) {
      bubblesGroupRef.current.rotation.y -= dt * 0.24;
      bubblesGroupRef.current.position.y = Math.sin(t * 1.1) * 0.08;
    }
  });

  return (
    <group ref={rootRef} position={[0, 0, 0]}>
      {/* 1. Primary Rotating Espresso Globe + Golden Meridian Wireframe */}
      <mesh ref={globeRef} material={materials.darkEspressoCore}>
        <sphereGeometry args={[0.72, 28, 28]} />
        <mesh material={materials.globeWireframe}>
          <sphereGeometry args={[0.735, 16, 12]} />
        </mesh>
      </mesh>

      {/* 2. Equatorial Latitude Band */}
      <mesh material={materials.brushedGold} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.76, 0.025, 14, 48]} />
      </mesh>

      {/* 3. Prime Meridian Vertical Band */}
      <mesh material={materials.paleGold}>
        <torusGeometry args={[0.76, 0.02, 14, 48]} />
      </mesh>

      {/* 4. Inner Tilted Orbital Ring */}
      <mesh
        ref={ring1Ref}
        material={materials.brushedGold}
        rotation={[Math.PI / 3.2, Math.PI / 5, 0]}
      >
        <torusGeometry args={[1.18, 0.034, 16, 64]} />
      </mesh>

      {/* 5. Outer Counter-Tilted Orbital Ring */}
      <mesh
        ref={ring2Ref}
        material={materials.paleGold}
        rotation={[-Math.PI / 4, Math.PI / 3, 0]}
      >
        <torusGeometry args={[1.52, 0.028, 16, 72]} />
      </mesh>

      {/* 6. Outer Meridian Bezel Frame */}
      <mesh material={materials.brushedGold} rotation={[0.15, 0, 0]}>
        <torusGeometry args={[1.85, 0.044, 18, 72]} />
      </mesh>

      {/* 7. North & South Celestial Axis Spires */}
      <mesh material={materials.paleGold} position={[0, 1.85, 0]}>
        <octahedronGeometry args={[0.13, 0]} />
      </mesh>
      <mesh material={materials.paleGold} position={[0, -1.85, 0]}>
        <octahedronGeometry args={[0.13, 0]} />
      </mesh>

      {/* 8. Orbiting Constellation Stars */}
      {starOffsets.map((pos, idx) => (
        <mesh key={idx} material={materials.starAccent} position={[pos[0], pos[1], pos[2]]}>
          <octahedronGeometry args={[0.09, 0]} />
        </mesh>
      ))}

      {/* 9. Orbiting Luminous Golden Bubbles */}
      <group ref={bubblesGroupRef}>
        {bubbleOffsets.map((b, idx) => (
          <mesh key={idx} material={materials.bubbleOrb} position={[b[0], b[1], b[2]]}>
            <sphereGeometry args={[b[3], 16, 16]} />
          </mesh>
        ))}
      </group>
    </group>
  );
});

const AuroraAstrolabe3D = React.memo(function AuroraAstrolabe3D() {
  const dragRot = useRef({ x: 0.18, y: 0.08 });
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
        const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
        dragRot.current.x = ny * 0.75;
        dragRot.current.y = -nx * 0.75;
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        dragRot.current = { x: 0.18, y: 0.08 };
      }}
      aria-label="Interactive 3D Aurora Summit Celestial Astrolabe Globe"
      style={{ transformStyle: 'flat', transform: 'translateZ(0)' }}
      className="relative h-[300px] w-full cursor-grab active:cursor-grabbing sm:h-[350px]"
    >
      <AstrolabeErrorBoundary>
        <Canvas
          dpr={[1, isMobile ? 1.5 : 2]}
          camera={{ position: [0, 0, 5.1], fov: 44 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
          }}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <RendererSetup />
          <ambientLight intensity={0.9} color="#FAF6EE" />
          <hemisphereLight args={['#FFF7D6', '#2A180D', 1.1]} />
          <directionalLight position={[4, 5, 4]} intensity={2.6} color="#F3E5AB" />
          <directionalLight position={[-4, -3, 2]} intensity={1.4} color="#D4AF37" />
          <pointLight position={[0, 2.5, 3]} intensity={1.8} color="#FFF3C4" />
          <AstrolabeAssembly dragRot={dragRot} />
        </Canvas>
      </AstrolabeErrorBoundary>

      <div className="pointer-events-none absolute right-3 bottom-3 text-[11px] tracking-[0.14em] text-[#D4AF37]/85">
        {hovered ? 'Interactive 3D Orbit' : 'Move pointer to tilt'}
      </div>
    </div>
  );
});

export default AuroraAstrolabe3D;
