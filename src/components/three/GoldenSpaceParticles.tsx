import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

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

function createGoldParticleTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255, 250, 224, 1)');
    grad.addColorStop(0.32, 'rgba(243, 229, 171, 0.92)');
    grad.addColorStop(0.68, 'rgba(212, 175, 55, 0.35)');
    grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const ParticleCloud = React.memo(function ParticleCloud({
  count,
  reducedMotion,
  isMobile,
}: {
  count: number;
  reducedMotion: boolean;
  isMobile: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const scrollTarget = useRef(0);
  const { gl } = useThree();

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerTarget.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerTarget.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => {
      scrollTarget.current = window.scrollY * 0.0018;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const { geometry, texture } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const goldBright = new THREE.Color('#FFF3C4');
    const goldRich = new THREE.Color('#D4AF37');
    const warmAmber = new THREE.Color('#B57E28');
    const temp = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 18;
      positions[i3 + 1] = (Math.random() - 0.5) * 14;
      positions[i3 + 2] = (Math.random() - 0.5) * 9;

      const t = Math.random();
      if (t < 0.38) temp.copy(goldBright);
      else if (t < 0.82) temp.copy(goldRich);
      else temp.copy(warmAmber);

      colors[i3] = temp.r;
      colors[i3 + 1] = temp.g;
      colors[i3 + 2] = temp.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const tex = createGoldParticleTexture();

    return { geometry: geo, texture: tex };
  }, [count]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      texture.dispose();
    };
  }, [geometry, texture]);

  useFrame((state, delta) => {
    const pts = pointsRef.current;
    if (!pts || reducedMotion) return;

    const dt = Math.min(delta, 0.05);
    pts.rotation.y += dt * 0.045;
    pts.rotation.x = THREE.MathUtils.damp(
      pts.rotation.x,
      pointerTarget.current.y * 0.14 + scrollTarget.current * 0.35,
      3.0,
      dt
    );
    pts.rotation.z = THREE.MathUtils.damp(
      pts.rotation.z,
      -pointerTarget.current.x * 0.1,
      3.0,
      dt
    );
    pts.position.y = Math.sin(state.clock.elapsedTime * 0.38) * 0.25;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={isMobile ? 0.24 : 0.21}
        map={texture}
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
        sizeAttenuation
      />
    </points>
  );
});

const GoldenSpaceParticles = React.memo(function GoldenSpaceParticles() {
  const [config, setConfig] = useState<{
    isMobile: boolean;
    isSoftwareGl: boolean;
    reducedMotion: boolean;
  } | null>(null);

  useEffect(() => {
    const check = () => {
      setConfig({
        isMobile: window.innerWidth < 768,
        isSoftwareGl: detectSoftwareWebGL(),
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      });
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!config) return null;

  const particleCount = config.isMobile ? 140 : 380;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1]">
      <Canvas
        dpr={config.isSoftwareGl ? [1, 1] : [1, config.isMobile ? 1.25 : 1.5]}
        camera={{ position: [0, 0, 6.2], fov: 55 }}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: 'high-performance',
        }}
        style={{ pointerEvents: 'none' }}
      >
        <ParticleCloud
          count={particleCount}
          reducedMotion={config.reducedMotion}
          isMobile={config.isMobile}
        />
      </Canvas>
    </div>
  );
});

export default GoldenSpaceParticles;
