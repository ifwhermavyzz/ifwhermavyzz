import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
  isGold: boolean;
}

export function AuroraParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const mouse = { x: -9999, y: -9999, active: false };
    let stars: Star[] = [];

    const createStars = (w: number, h: number) => {
      const count = Math.min(135, Math.max(55, Math.floor((w * h) / 14500)));
      stars = Array.from({ length: count }, (_, idx) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.14,
        vy: (Math.random() - 0.5) * 0.14,
        radius: Math.random() * 1.45 + 0.45,
        alpha: Math.random() * 0.55 + 0.25,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.008 + Math.random() * 0.015,
        isGold: idx % 5 === 0,
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createStars(width, height);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    let time = 0;

    const render = () => {
      time += 0.004;
      ctx.clearRect(0, 0, width, height);

      // Subtle midnight-indigo & warm gold aurora ribbons
      const auroraShiftX = Math.sin(time * 0.9) * width * 0.08;
      const auroraShiftY = Math.cos(time * 0.7) * height * 0.05;

      const grad1 = ctx.createRadialGradient(
        width * 0.28 + auroraShiftX,
        height * 0.24 + auroraShiftY,
        20,
        width * 0.28 + auroraShiftX,
        height * 0.24 + auroraShiftY,
        Math.max(width, height) * 0.55
      );
      grad1.addColorStop(0, 'rgba(30, 48, 102, 0.28)');
      grad1.addColorStop(0.45, 'rgba(15, 23, 48, 0.14)');
      grad1.addColorStop(1, 'rgba(5, 5, 5, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(
        width * 0.72 - auroraShiftX * 0.8,
        height * 0.36 - auroraShiftY,
        10,
        width * 0.72 - auroraShiftX * 0.8,
        height * 0.36 - auroraShiftY,
        Math.max(width, height) * 0.45
      );
      grad2.addColorStop(0, 'rgba(212, 175, 55, 0.11)');
      grad2.addColorStop(0.5, 'rgba(180, 140, 40, 0.04)');
      grad2.addColorStop(1, 'rgba(5, 5, 5, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Draw stars & subtle constellation connections
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (!prefersReducedMotion) {
          s.x += s.vx;
          s.y += s.vy;
          s.twinklePhase += s.twinkleSpeed;

          if (s.x < -10) s.x = width + 10;
          if (s.x > width + 10) s.x = -10;
          if (s.y < -10) s.y = height + 10;
          if (s.y > height + 10) s.y = -10;
        }

        const twinkle = 0.65 + 0.35 * Math.sin(s.twinklePhase);
        const alpha = s.alpha * twinkle;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.isGold
          ? `rgba(212, 175, 55, ${alpha})`
          : `rgba(248, 250, 252, ${alpha * 0.85})`;
        ctx.fill();

        // Subtle constellation geometry near cursor
        if (mouse.active && !prefersReducedMotion) {
          const dxMouse = s.x - mouse.x;
          const dyMouse = s.y - mouse.y;
          const distMouse = Math.hypot(dxMouse, dyMouse);

          if (distMouse < 165) {
            const lineOpacity = (1 - distMouse / 165) * 0.28;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(212, 175, 55, ${lineOpacity})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        // Faint celestial links between neighboring gold stars
        if (s.isGold) {
          for (let j = i + 1; j < stars.length; j++) {
            const other = stars[j];
            if (!other.isGold) continue;
            const dist = Math.hypot(s.x - other.x, s.y - other.y);
            if (dist < 130) {
              ctx.beginPath();
              ctx.moveTo(s.x, s.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = `rgba(212, 175, 55, ${(1 - dist / 130) * 0.1})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = window.requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90"
    />
  );
}
