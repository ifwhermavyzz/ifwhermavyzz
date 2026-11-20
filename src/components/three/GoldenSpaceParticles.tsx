import React, { Component, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

class WebGLErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function createStarTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255, 253, 240, 1)');
    grad.addColorStop(0.28, 'rgba(243, 229, 171, 0.95)');
    grad.addColorStop(0.65, 'rgba(212, 175, 55, 0.4)');
    grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createBubbleTexture(): THREE.CanvasTexture {
  const size = 96;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const c = size / 2;
    const grad = ctx.createRadialGradient(c, c, size * 0.08, c, c, c);
    grad.addColorStop(0, 'rgba(243, 229, 171, 0.08)');
    grad.addColorStop(0.62, 'rgba(212, 175, 55, 0.22)');
    grad.addColorStop(0.84, 'rgba(255, 244, 198, 0.72)');
    grad.addColorStop(0.94, 'rgba(212, 175, 55, 0.32)');
    grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const ParticleAndBubbleField = React.memo(function ParticleAndBubbleField({
  starCount,
  bubbleCount,
  isMobile,
}: {
  starCount: number;
  bubbleCount: number;
  isMobile: boolean;
}) {
  const starsRef = useRef<THREE.Points>(null);
  const bubblesRef = useRef<THREE.Points>(null);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const scrollTarget = useRef(0);
  const { gl, size } = useThree();

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerTarget.current.x = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      pointerTarget.current.y = -(e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
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

  const aspectSpreadX = useMemo(() => {
    const aspect = size.width / Math.max(1, size.height);
    return Math.max(14, Math.min(28, aspect * 15));
  }, [size.width, size.height]);

  const { starGeo, starTex, bubbleGeo, bubbleTex, bubbleSpeeds } = useMemo(() => {
    // 1. 3D Starfield Geometry
    const sGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(starCount * 3);
    const sCol = new Float32Array(starCount * 3);

    const goldBright = new THREE.Color('#FFF7D6');
    const goldRich = new THREE.Color('#D4AF37');
    const warmAmber = new THREE.Color('#C48C32');
    const temp = new THREE.Color();

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      sPos[i3] = (Math.random() - 0.5) * aspectSpreadX;
      sPos[i3 + 1] = (Math.random() - 0.5) * 16;
      sPos[i3 + 2] = (Math.random() - 0.5) * 10;

      const t = Math.random();
      if (t < 0.42) temp.copy(goldBright);
      else if (t < 0.85) temp.copy(goldRich);
      else temp.copy(warmAmber);

      sCol[i3] = temp.r;
      sCol[i3 + 1] = temp.g;
      sCol[i3 + 2] = temp.b;
    }

    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    sGeo.setAttribute('color', new THREE.BufferAttribute(sCol, 3));

    // 2. Floating 3D Golden Bubbles Geometry
    const bGeo = new THREE.BufferGeometry();
    const bPos = new Float32Array(bubbleCount * 3);
    const speeds = new Float32Array(bubbleCount);
    for (let i = 0; i < bubbleCount; i++) {
      const i3 = i * 3;
      bPos[i3] = (Math.random() - 0.5) * aspectSpreadX;
      bPos[i3 + 1] = (Math.random() - 0.5) * 14;
      bPos[i3 + 2] = (Math.random() - 0.5) * 6;
      speeds[i] = 0.22 + Math.random() * 0.42;
    }
    bGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3));

    return {
      starGeo: sGeo,
      starTex: createStarTexture(),
      bubbleGeo: bGeo,
      bubbleTex: createBubbleTexture(),
      bubbleSpeeds: speeds,
    };
  }, [starCount, bubbleCount, aspectSpreadX]);

  useEffect(() => {
    return () => {
      starGeo.dispose();
      starTex.dispose();
      bubbleGeo.dispose();
      bubbleTex.dispose();
    };
  }, [starGeo, starTex, bubbleGeo, bubbleTex]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const stars = starsRef.current;
    const bubbles = bubblesRef.current;

    if (stars) {
      stars.rotation.y += dt * 0.042;
      stars.rotation.x = THREE.MathUtils.damp(
        stars.rotation.x,
        pointerTarget.current.y * 0.16 + scrollTarget.current * 0.35,
        3.2,
        dt
      );
      stars.rotation.z = THREE.MathUtils.damp(
        stars.rotation.z,
        -pointerTarget.current.x * 0.12,
        3.2,
        dt
      );
      stars.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.22;
    }

    if (bubbles) {
      const attr = bubbleGeo.getAttribute('position') as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let i = 0; i < bubbleCount; i++) {
        const i3 = i * 3;
        arr[i3 + 1] += bubbleSpeeds[i] * dt;
        arr[i3] += Math.sin(state.clock.elapsedTime * 0.6 + i) * dt * 0.08;
        if (arr[i3 + 1] > 7.5) {
          arr[i3 + 1] = -7.5;
        }
      }
      attr.needsUpdate = true;

      bubbles.position.x = THREE.MathUtils.damp(
        bubbles.position.x,
        pointerTarget.current.x * 0.45,
        2.8,
        dt
      );
      bubbles.position.y = THREE.MathUtils.damp(
        bubbles.position.y,
        pointerTarget.current.y * 0.3,
        2.8,
        dt
      );
    }
  });

  return (
    <>
      <points ref={starsRef} geometry={starGeo}>
        <pointsMaterial
          size={isMobile ? 0.24 : 0.28}
          map={starTex}
          transparent
          opacity={0.96}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors
          sizeAttenuation
        />
      </points>

      <points ref={bubblesRef} geometry={bubbleGeo}>
        <pointsMaterial
          size={isMobile ? 0.48 : 0.56}
          map={bubbleTex}
          color="#F3E5AB"
          transparent
          opacity={0.78}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </>
  );
});

const GoldenSpaceParticles = React.memo(function GoldenSpaceParticles() {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const starCount = isMobile ? 160 : 420;
  const bubbleCount = isMobile ? 22 : 48;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2] h-full w-full"
    >
      <WebGLErrorBoundary>
        <Canvas
          dpr={[1, isMobile ? 1.5 : 2]}
          camera={{ position: [0, 0, 6.2], fov: 56 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
          }}
          style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
        >
          <ParticleAndBubbleField
            starCount={starCount}
            bubbleCount={bubbleCount}
            isMobile={isMobile}
          />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
});

export default GoldenSpaceParticles;
