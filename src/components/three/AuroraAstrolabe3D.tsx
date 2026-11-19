import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

function detectSoftwareWebGL(): boolean {
  if (typeof document === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function StudioEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.15;

    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    pmrem.dispose();

    return () => {
      env.dispose();
      scene.environment = null;
    };
  }, [gl, scene]);

  return null;
}

const AstrolabeAssembly = React.memo(function AstrolabeAssembly({
  dragRot,
  reducedMotion,
}: {
  dragRot: React.MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}) {
  const rootRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const materials = useMemo(() => {
    return {
      brushedGold: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#D4AF37'),
        metalness: 0.92,
        roughness: 0.22,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
      }),
      paleGold: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#F3E5AB'),
        metalness: 0.85,
        roughness: 0.16,
      }),
      darkEspressoCore: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#24150D'),
        metalness: 0.35,
        roughness: 0.58,
      }),
      starAccent: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FAF6EE'),
        emissive: new THREE.Color('#D4AF37'),
        emissiveIntensity: 0.75,
        roughness: 0.2,
        metalness: 0.4,
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

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    if (!rootRef.current) return;

    if (!reducedMotion) {
      rootRef.current.rotation.y += dt * 0.26;
      rootRef.current.rotation.x = THREE.MathUtils.damp(
        rootRef.current.rotation.x,
        dragRot.current.x + Math.sin(state.clock.elapsedTime * 0.6) * 0.12,
        3.5,
        dt
      );
      rootRef.current.rotation.z = THREE.MathUtils.damp(
        rootRef.current.rotation.z,
        dragRot.current.y,
        3.5,
        dt
      );

      if (ring1Ref.current) ring1Ref.current.rotation.z += dt * 0.4;
      if (ring2Ref.current) ring2Ref.current.rotation.x -= dt * 0.32;
    }
  });

  return (
    <group ref={rootRef} position={[0, 0, 0]}>
      {/* 1. Primary Core Sphere (Espresso Globe) */}
      <mesh material={materials.darkEspressoCore}>
        <sphereGeometry args={[0.72, 32, 32]} />
      </mesh>

      {/* 2. Equatorial Latitude Wireframe Band */}
      <mesh material={materials.brushedGold} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.74, 0.022, 14, 48]} />
      </mesh>

      {/* 3. Prime Meridian Vertical Band */}
      <mesh material={materials.paleGold}>
        <torusGeometry args={[0.74, 0.018, 14, 48]} />
      </mesh>

      {/* 4. Inner Tilted Orbital Ring */}
      <mesh
        ref={ring1Ref}
        material={materials.brushedGold}
        rotation={[Math.PI / 3.2, Math.PI / 5, 0]}
      >
        <torusGeometry args={[1.18, 0.032, 16, 64]} />
      </mesh>

      {/* 5. Outer Counter-Tilted Orbital Ring */}
      <mesh
        ref={ring2Ref}
        material={materials.paleGold}
        rotation={[-Math.PI / 4, Math.PI / 3, 0]}
      >
        <torusGeometry args={[1.52, 0.026, 16, 72]} />
      </mesh>

      {/* 6. Outer Meridian Bezel Frame */}
      <mesh material={materials.brushedGold} rotation={[0.15, 0, 0]}>
        <torusGeometry args={[1.85, 0.042, 18, 72]} />
      </mesh>

      {/* 7. North & South Celestial Axis Spires */}
      <mesh material={materials.paleGold} position={[0, 1.85, 0]}>
        <octahedronGeometry args={[0.12, 0]} />
      </mesh>
      <mesh material={materials.paleGold} position={[0, -1.85, 0]}>
        <octahedronGeometry args={[0.12, 0]} />
      </mesh>

      {/* 8. Orbiting Constellation Nodes */}
      {starOffsets.map((pos, idx) => (
        <mesh key={idx} material={materials.starAccent} position={[pos[0], pos[1], pos[2]]}>
          <octahedronGeometry args={[0.08, 0]} />
        </mesh>
      ))}
    </group>
  );
});

const AuroraAstrolabe3D = React.memo(function AuroraAstrolabe3D() {
  const dragRot = useRef({ x: 0.18, y: 0.08 });
  const [hovered, setHovered] = useState(false);
  const [config, setConfig] = useState<{
    isMobile: boolean;
    isSoftwareGl: boolean;
    reducedMotion: boolean;
  } | null>(null);

  useEffect(() => {
    setConfig({
      isMobile: window.innerWidth < 768,
      isSoftwareGl: detectSoftwareWebGL(),
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
  }, []);

  if (!config) {
    return <div className="h-[300px] w-full sm:h-[340px]" />;
  }

  return (
    <div
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        dragRot.current.x = ny * 0.7;
        dragRot.current.y = -nx * 0.7;
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        dragRot.current = { x: 0.18, y: 0.08 };
      }}
      aria-label="Interactive 3D Aurora Summit Celestial Astrolabe"
      className="relative h-[300px] w-full cursor-grab active:cursor-grabbing sm:h-[340px]"
    >
      <Canvas
        dpr={config.isSoftwareGl ? [1, 1] : [1, config.isMobile ? 1.5 : 2]}
        camera={{ position: [0, 0, 5.2], fov: 44 }}
        gl={{
          alpha: true,
          antialias: !config.isSoftwareGl,
          powerPreference: 'high-performance',
        }}
      >
        <StudioEnvironment />
        <hemisphereLight args={['#FAF6EE', '#2A180D', 0.85]} />
        <directionalLight position={[4, 5, 4]} intensity={2.2} color="#F3E5AB" />
        <directionalLight position={[-4, -3, -2]} intensity={0.9} color="#D4AF37" />
        <AstrolabeAssembly dragRot={dragRot} reducedMotion={config.reducedMotion} />
      </Canvas>

      <div className="pointer-events-none absolute right-3 bottom-3 text-[11px] tracking-[0.14em] text-[#D4AF37]/80">
        {hovered ? 'Interactive 3D Orbit' : 'Move pointer to tilt'}
      </div>
    </div>
  );
});

export default AuroraAstrolabe3D;
