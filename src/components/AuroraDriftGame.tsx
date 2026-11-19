import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, Rocket, Trophy, Volume2, VolumeX, Pause } from 'lucide-react';
import { HoverBorderGradient } from './aceternity/HoverBorderGradient';
import { CardSpotlight } from './aceternity/CardSpotlight';

type GameState =
  | 'TITLE_MENU'
  | 'PLAYING'
  | 'CHECKPOINT'
  | 'PARACHUTE'
  | 'PAUSED'
  | 'GAME_OVER';

interface StarOrb {
  x: number;
  y: number;
  vy: number;
  r: number;
  isBoost: boolean;
  pulse: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  rot: number;
  rotSpeed: number;
  vertices: number[];
}

interface LaserGate {
  y: number;
  vy: number;
  gapX: number;
  gapWidth: number;
  hit: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  life: number;
}

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const HIGH_SCORE_KEY = 'aurora_summit_ascent_best';
const MOON_DISTANCE_KM = 384400;
const CHECKPOINT_KM = 100000;

function getZoneName(km: number): string {
  if (km < 20) return 'TROPOSPHERE';
  if (km < 500) return 'STRATOSPHERE';
  if (km < 12000) return 'LOW ORBIT';
  if (km < 100000) return 'AURORA BELT';
  if (km < MOON_DISTANCE_KM) return 'DEEP SPACE';
  return 'THE MOON';
}

function playSynthTone(
  ctx: AudioContext | null,
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainVal = 0.07
) {
  if (!ctx) return;
  try {
    if (ctx.state === 'suspended') void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore browser autoplay audio guard
  }
}

export const AuroraDriftGame = React.memo(function AuroraDriftGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [altitudeKm, setAltitudeKm] = useState(0);
  const [orbsCollected, setOrbsCollected] = useState(0);
  const [boostsCollected, setBoostsCollected] = useState(0);
  const [runwayPct, setRunwayPct] = useState(100);
  const [multiplier, setMultiplier] = useState(1);
  const [flashLabel, setFlashLabel] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [bestKm, setBestKm] = useState<number>(() => {
    try {
      return Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);
    } catch {
      return 0;
    }
  });

  const stateRef = useRef<GameState>('TITLE_MENU');
  const mutedRef = useRef(false);
  mutedRef.current = muted;
  stateRef.current = gameState;

  const gameDataRef = useRef({
    width: 720,
    height: 460,
    playerX: 360,
    playerY: 350,
    targetX: 360,
    targetY: 350,
    altitude: 0,
    speedMultiplier: 1,
    multiplier: 1,
    checkpointShown: false,
    runway: 100,
    orbsCount: 0,
    boostsCount: 0,
    boostTimer: 0,
    hitFlash: 0,
    parachuteY: 0,
    starSpawnTimer: 0,
    meteorSpawnTimer: 0,
    gateSpawnTimer: 3.5,
    shootingStarTimer: 1.5,
    trailTimer: 0,
    stars: [] as StarOrb[],
    meteors: [] as Meteor[],
    gates: [] as LaserGate[],
    shootingStars: [] as ShootingStar[],
    particles: [] as TrailParticle[],
    bgStars: Array.from({ length: 56 }, () => ({
      x: Math.random(),
      y: Math.random(),
      s: Math.random() * 1.5 + 0.4,
      sp: Math.random() * 0.22 + 0.08,
    })),
    keys: new Set<string>(),
  });

  const triggerFlash = useCallback((label: string) => {
    setFlashLabel(label);
    window.setTimeout(() => {
      setFlashLabel((curr) => (curr === label ? null : curr));
    }, 1150);
  }, []);

  const ensureAudio = useCallback(() => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) audioCtxRef.current = new AudioCtx();
    }
  }, []);

  const saveBest = useCallback((km: number) => {
    const rounded = Math.round(km);
    setBestKm((prev) => {
      const next = Math.max(prev, rounded);
      try {
        localStorage.setItem(HIGH_SCORE_KEY, String(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  const resetAndStart = useCallback(() => {
    ensureAudio();
    const d = gameDataRef.current;
    d.playerX = d.width / 2;
    d.playerY = d.height * 0.76;
    d.targetX = d.width / 2;
    d.targetY = d.height * 0.76;
    d.altitude = 0;
    d.speedMultiplier = 1;
    d.multiplier = 1;
    d.checkpointShown = false;
    d.runway = 100;
    d.orbsCount = 0;
    d.boostsCount = 0;
    d.boostTimer = 0;
    d.hitFlash = 0;
    d.parachuteY = 0;
    d.starSpawnTimer = 0.2;
    d.meteorSpawnTimer = 1.0;
    d.gateSpawnTimer = 4.2;
    d.stars = [];
    d.meteors = [];
    d.gates = [];
    d.particles = [];

    setAltitudeKm(0);
    setOrbsCollected(0);
    setBoostsCollected(0);
    setRunwayPct(100);
    setMultiplier(1);
    setGameState('PLAYING');
    triggerFlash('Perfect launch');

    if (!mutedRef.current) {
      playSynthTone(audioCtxRef.current, 523.25, 0.16, 'triangle', 0.08);
    }
  }, [ensureAudio, triggerFlash]);

  const handleBankScore = () => {
    const d = gameDataRef.current;
    const banked = Math.round(d.altitude * 1.5);
    d.altitude = banked;
    setAltitudeKm(banked);
    saveBest(banked);
    setGameState('GAME_OVER');
  };

  const handleKeepGoing = () => {
    const d = gameDataRef.current;
    d.multiplier = 2;
    d.runway = Math.min(100, d.runway + 25);
    setMultiplier(2);
    setRunwayPct(Math.round(d.runway));
    setGameState('PLAYING');
    triggerFlash('Deep Space x2');
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current !== 'PLAYING') return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
      }
      gameDataRef.current.keys.add(e.key.toLowerCase());
    };
    const onKeyUp = (e: KeyboardEvent) => {
      gameDataRef.current.keys.delete(e.key.toLowerCase());
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const d = gameDataRef.current;
      d.width = w;
      d.height = h;
      if (stateRef.current === 'TITLE_MENU') {
        d.playerX = w / 2;
        d.playerY = h * 0.74;
        d.targetX = w / 2;
        d.targetY = h * 0.74;
      }
    };

    resize();
    window.addEventListener('resize', resize);

    let lastTime = performance.now();
    let hudSyncTimer = 0;
    let rafId = 0;

    const spawnBurst = (x: number, y: number, color: string, count = 10) => {
      const d = gameDataRef.current;
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const sp = 50 + Math.random() * 120;
        d.particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 0.45 + Math.random() * 0.25,
          maxLife: 0.7,
          color,
          size: 2 + Math.random() * 2,
        });
      }
    };

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const d = gameDataRef.current;
      const { width: w, height: h } = d;

      // Deep espresso-cosmic backdrop
      ctx.fillStyle = '#100905';
      ctx.fillRect(0, 0, w, h);

      // Subtle distant planet moon sphere in deep space (like book.sequel.co)
      const moonProgress = Math.min(1, d.altitude / MOON_DISTANCE_KM);
      if (d.altitude > 12000 || stateRef.current === 'TITLE_MENU') {
        const moonY = h * (0.28 - moonProgress * 0.06);
        const moonR = Math.min(w * 0.16, 78);
        const moonX = w * 0.76;
        const mGrad = ctx.createRadialGradient(
          moonX - moonR * 0.3,
          moonY - moonR * 0.3,
          moonR * 0.1,
          moonX,
          moonY,
          moonR
        );
        mGrad.addColorStop(0, 'rgba(243, 229, 171, 0.32)');
        mGrad.addColorStop(0.55, 'rgba(120, 82, 36, 0.25)');
        mGrad.addColorStop(1, 'rgba(26, 16, 10, 0)');
        ctx.fillStyle = mGrad;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Red damage/low-runway vignette
      if (d.hitFlash > 0 || (stateRef.current === 'PLAYING' && d.runway < 25)) {
        const vigAlpha =
          d.hitFlash > 0
            ? Math.min(0.45, d.hitFlash * 0.9)
            : 0.18 + Math.sin(now * 0.01) * 0.08;
        const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.75);
        vig.addColorStop(0, 'rgba(0,0,0,0)');
        vig.addColorStop(1, `rgba(220, 38, 38, ${vigAlpha})`);
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, w, h);
      }

      // Starfield scroll
      const starVel =
        stateRef.current === 'PLAYING'
          ? (d.boostTimer > 0 ? 4.2 : 1.9) * d.speedMultiplier
          : 0.4;
      for (let i = 0; i < d.bgStars.length; i++) {
        const s = d.bgStars[i];
        s.y += s.sp * dt * starVel;
        if (s.y > 1) {
          s.y = 0;
          s.x = Math.random();
        }
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.s, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? 'rgba(243, 229, 171, 0.72)' : 'rgba(250, 246, 238, 0.36)';
        ctx.fill();
      }

      // Shooting stars
      d.shootingStarTimer -= dt;
      if (d.shootingStarTimer <= 0) {
        d.shootingStars.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.35,
          vx: -280 - Math.random() * 140,
          vy: 160 + Math.random() * 90,
          len: 45 + Math.random() * 35,
          life: 0.7,
        });
        d.shootingStarTimer = 1.6 + Math.random() * 2.2;
      }

      for (let i = d.shootingStars.length - 1; i >= 0; i--) {
        const ss = d.shootingStars[i];
        ss.x += ss.vx * dt;
        ss.y += ss.vy * dt;
        ss.life -= dt;
        if (ss.life <= 0) {
          d.shootingStars.splice(i, 1);
          continue;
        }
        const grad = ctx.createLinearGradient(
          ss.x,
          ss.y,
          ss.x - ss.vx * 0.14,
          ss.y - ss.vy * 0.14
        );
        grad.addColorStop(0, `rgba(243, 229, 171, ${ss.life})`);
        grad.addColorStop(1, 'rgba(243, 229, 171, 0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 0.14, ss.y - ss.vy * 0.14);
        ctx.stroke();
      }

      if (stateRef.current === 'PLAYING') {
        if (d.hitFlash > 0) d.hitFlash -= dt;
        if (d.boostTimer > 0) d.boostTimer -= dt;

        // Exponential climb rate like book.sequel.co (6 km -> 1,000+ km -> 100,000+ km)
        const boostFactor = d.boostTimer > 0 ? 2.4 : 1;
        const climbRate = (18 + d.altitude * 0.048) * boostFactor * d.multiplier;
        d.altitude += climbRate * dt;
        d.speedMultiplier = 1 + Math.min(1.7, d.altitude / 90000);

        // Drain runway fuel steadily
        d.runway = Math.max(0, d.runway - dt * (3.6 + d.speedMultiplier * 0.9));

        // Checkpoint modal at 100,000 km (Bank it vs Keep going!)
        if (!d.checkpointShown && d.altitude >= CHECKPOINT_KM) {
          d.checkpointShown = true;
          setAltitudeKm(Math.round(d.altitude));
          setRunwayPct(Math.round(d.runway));
          setGameState('CHECKPOINT');
        }

        // Trigger Parachute Descent when Runway hits 0
        if (d.runway <= 0) {
          d.runway = 0;
          d.parachuteY = d.playerY;
          setRunwayPct(0);
          setAltitudeKm(Math.round(d.altitude));
          saveBest(d.altitude);
          setGameState('PARACHUTE');
          if (!mutedRef.current) {
            playSynthTone(audioCtxRef.current, 196, 0.35, 'triangle', 0.08);
          }
        }

        // Keyboard controls
        const kbSpeed = 380 * dt;
        if (d.keys.has('arrowleft') || d.keys.has('a')) d.targetX -= kbSpeed;
        if (d.keys.has('arrowright') || d.keys.has('d')) d.targetX += kbSpeed;
        if (d.keys.has('arrowup') || d.keys.has('w')) d.targetY -= kbSpeed;
        if (d.keys.has('arrowdown') || d.keys.has('s')) d.targetY += kbSpeed;

        d.targetX = Math.max(26, Math.min(w - 36, d.targetX));
        d.targetY = Math.max(h * 0.35, Math.min(h - 46, d.targetY));

        const damp = 1 - Math.exp(-16 * dt);
        d.playerX += (d.targetX - d.playerX) * damp;
        d.playerY += (d.targetY - d.playerY) * damp;

        // Thruster exhaust particles
        d.trailTimer -= dt;
        if (d.trailTimer <= 0) {
          d.trailTimer = 0.032;
          d.particles.push({
            x: d.playerX + (Math.random() - 0.5) * 6,
            y: d.playerY + 18,
            vx: (Math.random() - 0.5) * 20,
            vy: 90 + Math.random() * 60,
            life: 0.35,
            maxLife: 0.35,
            color: d.boostTimer > 0 ? '#FAF6EE' : '#D4AF37',
            size: d.boostTimer > 0 ? 3.2 : 2.1,
          });
        }

        // Spawn arcing comet orbs & boost crests
        d.starSpawnTimer -= dt;
        if (d.starSpawnTimer <= 0) {
          const isBoost = Math.random() < 0.2;
          d.stars.push({
            x: 40 + Math.random() * (w - 86),
            y: -24,
            vy: (135 + Math.random() * 55) * d.speedMultiplier,
            r: isBoost ? 17 : 10,
            isBoost,
            pulse: Math.random() * Math.PI * 2,
          });
          d.starSpawnTimer = isBoost ? 0.85 : 0.42;
        }

        // Spawn red asteroids
        d.meteorSpawnTimer -= dt;
        if (d.meteorSpawnTimer <= 0) {
          const r = 13 + Math.random() * 12;
          d.meteors.push({
            x: 34 + Math.random() * (w - 74),
            y: -32,
            vx: (Math.random() - 0.5) * 44 * d.speedMultiplier,
            vy: (170 + Math.random() * 80) * d.speedMultiplier,
            r,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 3,
            vertices: Array.from({ length: 7 }, () => 0.78 + Math.random() * 0.34),
          });
          d.meteorSpawnTimer = Math.max(0.45, 1.15 - d.speedMultiplier * 0.26);
        }

        // Spawn "Red Tape" laser barrier with pass-through gap
        d.gateSpawnTimer -= dt;
        if (d.gateSpawnTimer <= 0 && d.altitude > 600) {
          const gapW = Math.max(92, w * 0.22);
          d.gates.push({
            y: -20,
            vy: 145 * d.speedMultiplier,
            gapX: 40 + Math.random() * (w - 80 - gapW),
            gapWidth: gapW,
            hit: false,
          });
          d.gateSpawnTimer = Math.max(3.2, 5.4 - d.speedMultiplier * 0.8);
        }

        // Collect orbs/boosts
        for (let i = d.stars.length - 1; i >= 0; i--) {
          const st = d.stars[i];
          st.y += st.vy * dt;
          st.pulse += dt * 4.5;

          const dist = Math.hypot(st.x - d.playerX, st.y - d.playerY);
          if (dist < st.r + 20) {
            if (st.isBoost) {
              d.boostsCount += 1;
              d.boostTimer = 2.6;
              d.runway = Math.min(100, d.runway + 10);
              setBoostsCollected(d.boostsCount);
              triggerFlash('Rocket power · +10% RUNWAY');
              spawnBurst(st.x, st.y, '#F3E5AB', 14);
              if (!mutedRef.current) playSynthTone(audioCtxRef.current, 880, 0.2, 'sine', 0.08);
            } else {
              d.orbsCount += 1;
              d.runway = Math.min(100, d.runway + 3.2);
              setOrbsCollected(d.orbsCount);
              spawnBurst(st.x, st.y, '#D4AF37', 7);
              if (!mutedRef.current) playSynthTone(audioCtxRef.current, 660, 0.1, 'sine', 0.05);
            }
            d.stars.splice(i, 1);
            continue;
          }
          if (st.y > h + 30) d.stars.splice(i, 1);
        }

        // Collide asteroids
        for (let i = d.meteors.length - 1; i >= 0; i--) {
          const m = d.meteors[i];
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          m.rot += m.rotSpeed * dt;
          if (m.x < m.r || m.x > w - m.r - 14) m.vx *= -1;

          const dist = Math.hypot(m.x - d.playerX, m.y - d.playerY);
          if (dist < m.r + 14) {
            d.runway = Math.max(0, d.runway - 16);
            d.hitFlash = 0.6;
            triggerFlash('-16% RUNWAY');
            spawnBurst(m.x, m.y, '#EF4444', 12);
            if (!mutedRef.current) playSynthTone(audioCtxRef.current, 130, 0.22, 'sawtooth', 0.08);
            d.meteors.splice(i, 1);
            continue;
          }
          if (m.y > h + 40) d.meteors.splice(i, 1);
        }

        // Collide Red Tape laser bars
        for (let i = d.gates.length - 1; i >= 0; i--) {
          const g = d.gates[i];
          g.y += g.vy * dt;

          if (!g.hit && Math.abs(g.y - d.playerY) < 12) {
            const insideGap = d.playerX > g.gapX + 8 && d.playerX < g.gapX + g.gapWidth - 8;
            if (!insideGap) {
              g.hit = true;
              d.runway = Math.max(0, d.runway - 20);
              d.hitFlash = 0.7;
              triggerFlash('RED TAPE · -20% RUNWAY');
              spawnBurst(d.playerX, g.y, '#EF4444', 14);
              if (!mutedRef.current) playSynthTone(audioCtxRef.current, 110, 0.28, 'sawtooth', 0.08);
            }
          }
          if (g.y > h + 30) d.gates.splice(i, 1);
        }

        hudSyncTimer += dt;
        if (hudSyncTimer >= 0.07) {
          hudSyncTimer = 0;
          setAltitudeKm(Math.round(d.altitude));
          setRunwayPct(Math.round(d.runway));
        }
      }

      // Parachute descent transition (just like book.sequel.co 0:37–0:40!)
      if (stateRef.current === 'PARACHUTE') {
        d.parachuteY += 95 * dt;
        if (d.parachuteY > h + 45) {
          setGameState('GAME_OVER');
        }
      }

      // Draw Red Tape laser gates
      for (const g of d.gates) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.fillRect(0, g.y - 3, g.gapX, 6);
        ctx.fillRect(g.gapX + g.gapWidth, g.y - 3, w - (g.gapX + g.gapWidth) - 18, 6);
      }

      // Draw comet orbs & boost crests
      for (const st of d.stars) {
        ctx.save();
        ctx.translate(st.x, st.y);
        const s = 1 + Math.sin(st.pulse) * 0.1;
        ctx.scale(s, s);

        if (st.isBoost) {
          ctx.beginPath();
          ctx.arc(0, 0, st.r, 0, Math.PI * 2);
          ctx.strokeStyle = '#F3E5AB';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, 0, st.r * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(212, 175, 55, 0.35)';
          ctx.fill();

          ctx.fillStyle = '#FAF6EE';
          ctx.beginPath();
          ctx.moveTo(0, -7);
          ctx.lineTo(5, 5);
          ctx.lineTo(-5, 5);
          ctx.closePath();
          ctx.fill();
        } else {
          // Glowing trailing orb
          const trail = ctx.createLinearGradient(0, -18, 0, 6);
          trail.addColorStop(0, 'rgba(243, 229, 171, 0)');
          trail.addColorStop(1, 'rgba(212, 175, 55, 0.65)');
          ctx.fillStyle = trail;
          ctx.beginPath();
          ctx.moveTo(-4, 0);
          ctx.lineTo(4, 0);
          ctx.lineTo(0, -18);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.arc(0, 0, st.r * 0.78, 0, Math.PI * 2);
          ctx.fillStyle = '#F3E5AB';
          ctx.fill();
        }
        ctx.restore();
      }

      // Draw red/obsidian asteroids
      for (const m of d.meteors) {
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.rot);
        ctx.beginPath();
        const total = m.vertices.length;
        for (let v = 0; v < total; v++) {
          const ang = (v / total) * Math.PI * 2;
          const rad = m.r * m.vertices[v];
          const px = Math.cos(ang) * rad;
          const py = Math.sin(ang) * rad;
          if (v === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = '#B91C1C';
        ctx.fill();
        ctx.strokeStyle = 'rgba(252, 165, 165, 0.55)';
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.restore();
      }

      // Draw particles
      for (let i = d.particles.length - 1; i >= 0; i--) {
        const pt = d.particles[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.life -= dt;
        if (pt.life <= 0) {
          d.particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Draw Envoy with Shield Bubble or Parachute
      if (stateRef.current === 'PARACHUTE') {
        ctx.save();
        ctx.translate(d.playerX, d.parachuteY);
        // Parachute canopy
        ctx.beginPath();
        ctx.arc(0, -24, 24, Math.PI, 0);
        ctx.closePath();
        ctx.fillStyle = '#F3E5AB';
        ctx.fill();
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.7)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-22, -24);
        ctx.lineTo(0, 0);
        ctx.moveTo(22, -24);
        ctx.lineTo(0, 0);
        ctx.stroke();
        // Envoy silhouette
        ctx.fillStyle = '#FAF6EE';
        ctx.beginPath();
        ctx.arc(0, 2, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.save();
        ctx.translate(d.playerX, d.playerY);

        // Energy shield bubble
        const shieldR = d.boostTimer > 0 ? 28 : 23;
        const shieldGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, shieldR);
        shieldGrad.addColorStop(0, 'rgba(212, 175, 55, 0.04)');
        shieldGrad.addColorStop(0.8, 'rgba(243, 229, 171, 0.22)');
        shieldGrad.addColorStop(1, 'rgba(243, 229, 171, 0.55)');
        ctx.fillStyle = shieldGrad;
        ctx.beginPath();
        ctx.arc(0, 0, shieldR, 0, Math.PI * 2);
        ctx.fill();

        // Envoy crest craft
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(11, 10);
        ctx.lineTo(0, 5);
        ctx.lineTo(-11, 10);
        ctx.closePath();
        ctx.fillStyle = '#F3E5AB';
        ctx.fill();
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.restore();
      }

      // Right-side vertical altitude progress rail (to 384,400 km)
      const railX = w - 12;
      const railTop = 44;
      const railBottom = h - 44;
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(railX, railTop);
      ctx.lineTo(railX, railBottom);
      ctx.stroke();

      const dotY = railBottom - moonProgress * (railBottom - railTop);
      ctx.fillStyle = '#F3E5AB';
      ctx.beginPath();
      ctx.arc(railX, dotY, 3.5, 0, Math.PI * 2);
      ctx.fill();

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [saveBest, triggerFlash]);

  const updatePointerTarget = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const d = gameDataRef.current;
    d.targetX = clientX - rect.left;
    d.targetY = clientY - rect.top;
  };

  return (
    <section
      id="game"
      className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.18em] text-[#D4AF37]">
            Interactive Arcade
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#FAF6EE] sm:text-4xl">
            Aurora Ascent: Journey to Orbit
          </h2>
        </div>
        <p className="max-w-md text-sm text-[#D6C7B2]">
          Inspired by <span className="text-[#F3E5AB]">book.sequel.co</span>—pilot the golden
          envoy through cosmic boosts &amp; red-tape barriers. Touch drag on phone or mouse / arrow
          keys on laptop.
        </p>
      </div>

      <HoverBorderGradient roundedClassName="rounded-3xl">
        <CardSpotlight className="rounded-3xl p-4 sm:p-6">
          {/* Playable Frame */}
          <div
            className="relative h-[430px] w-full overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-[#100905] sm:h-[490px]"
            style={{ touchAction: 'none' }}
          >
            <canvas
              ref={canvasRef}
              onPointerDown={(e) => {
                if (stateRef.current === 'PLAYING') updatePointerTarget(e.clientX, e.clientY);
              }}
              onPointerMove={(e) => {
                if (stateRef.current === 'PLAYING') updatePointerTarget(e.clientX, e.clientY);
              }}
              className="block h-full w-full cursor-crosshair"
            />

            {/* Top-Left Live Odometer & Zone (like book.sequel.co) */}
            <div className="pointer-events-none absolute top-4 left-4 z-10">
              <div className="flex items-baseline gap-1.5 font-sans text-2xl font-bold text-[#FAF6EE] tabular-nums sm:text-3xl">
                <span>{altitudeKm.toLocaleString()}</span>
                <span className="text-xs font-medium tracking-wider text-[#C5B49A]">KM</span>
              </div>
              <div className="text-[11px] font-medium tracking-[0.2em] text-[#D4AF37]">
                {getZoneName(altitudeKm)}
                {multiplier > 1 ? ` · x${multiplier}` : ''}
              </div>
            </div>

            {/* Top-Right Controls */}
            <div className="absolute top-4 right-5 z-20 flex items-center gap-2">
              <div className="hidden items-center gap-1.5 rounded-full border border-[#D4AF37]/25 bg-[#1A100A]/80 px-3 py-1 text-xs text-[#D6C7B2] tabular-nums sm:flex">
                <Trophy className="h-3.5 w-3.5 text-[#D4AF37]" />
                <span>Best: {bestKm.toLocaleString()} KM</span>
              </div>

              {gameState === 'PLAYING' && (
                <button
                  type="button"
                  onClick={() => setGameState('PAUSED')}
                  aria-label="Pause game"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#1A100A]/80 text-[#FAF6EE] hover:border-[#D4AF37]"
                >
                  <Pause className="h-4 w-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? 'Unmute audio' : 'Mute audio'}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#1A100A]/80 text-[#F3E5AB] hover:border-[#D4AF37]"
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>

            {/* Center Mid-Flight Callout Flash */}
            {flashLabel && gameState === 'PLAYING' && (
              <div className="pointer-events-none absolute inset-x-0 top-1/3 z-10 text-center">
                <span className="font-serif text-xl font-semibold text-[#F3E5AB] drop-shadow sm:text-2xl">
                  {flashLabel}
                </span>
              </div>
            )}

            {/* Bottom Runway Fuel Bar (like book.sequel.co) */}
            <div className="pointer-events-none absolute right-6 bottom-3.5 left-4 z-10 flex items-center justify-between gap-4">
              <div className="flex-1 max-w-xs">
                <div className="mb-1 flex items-center justify-between text-[10px] font-semibold tracking-[0.18em] text-[#C5B49A]">
                  <span>{runwayPct < 25 && gameState === 'PLAYING' ? 'LOW RUNWAY' : 'RUNWAY'}</span>
                  <span className="tabular-nums">
                    ✦ {orbsCollected} · 🚀 {boostsCollected}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
                  <div
                    className={`h-full rounded-full transition-[width] duration-100 ${
                      runwayPct < 25 ? 'bg-rose-500' : 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]'
                    }`}
                    style={{ width: `${runwayPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Title Screen */}
            {gameState === 'TITLE_MENU' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#1A100A]/75 p-6 text-center backdrop-blur-sm"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/45 bg-[#1A100A]">
                  <Rocket className="h-6 w-6 text-[#F3E5AB]" />
                </div>
                <h3 className="mt-4 font-serif text-2xl font-semibold text-[#FAF6EE] sm:text-3xl">
                  Launch Into Aurora Orbit
                </h3>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-[#D6C7B2] sm:text-sm">
                  Collect golden stars &amp; boosts to sustain your Runway fuel. Dodge red
                  asteroids and Red Tape gates. Reach 100,000 KM to bank your score or risk x2!
                </p>
                <button
                  type="button"
                  onClick={resetAndStart}
                  className="mt-6 inline-flex min-h-[46px] items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C667] to-[#C69C2B] px-7 py-2.5 text-sm font-semibold text-[#1A100A] shadow-[0_12px_32px_-8px_rgba(212,175,55,0.55)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Tap to Launch</span>
                </button>
              </motion.div>
            )}

            {/* Checkpoint Modal ("Bank it" vs "Keep going" like book.sequel.co!) */}
            {gameState === 'CHECKPOINT' && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#1A100A]/85 p-5 backdrop-blur-md">
                <div className="w-full max-w-sm space-y-3 text-center">
                  <p className="text-xs font-medium tracking-[0.2em] text-[#D4AF37]">
                    AURORA ORBIT · 100,000 KM
                  </p>
                  <h3 className="font-serif text-3xl font-semibold text-[#FAF6EE]">
                    Orbital Milestone
                  </h3>
                  <button
                    type="button"
                    onClick={handleBankScore}
                    className="w-full rounded-2xl border border-[#D4AF37]/35 bg-[#24160E] p-4 text-left transition-colors hover:border-[#D4AF37]"
                  >
                    <div className="text-sm font-semibold text-[#FAF6EE]">Bank it</div>
                    <div className="text-xs text-[#C5B49A]">
                      End here safely with x1.5 altitude bonus
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={handleKeepGoing}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#E5C667] p-4 text-left text-[#1A100A]"
                  >
                    <div className="text-sm font-semibold">Keep going</div>
                    <div className="text-xs opacity-85">
                      Deep Space x2 climb &amp; +25% Runway boost
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Paused */}
            {gameState === 'PAUSED' && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#1A100A]/80 p-6 text-center backdrop-blur-sm">
                <h3 className="font-serif text-2xl font-semibold text-[#FAF6EE]">Flight Paused</h3>
                <div className="mt-5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGameState('PLAYING')}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5C667] px-6 py-2 text-sm font-semibold text-[#1A100A]"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    <span>Resume</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetAndStart}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#D4AF37]/40 px-5 py-2 text-sm font-medium text-[#FAF6EE]"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Restart</span>
                  </button>
                </div>
              </div>
            )}

            {/* Game Over Summary (like book.sequel.co 0:41!) */}
            {gameState === 'GAME_OVER' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#1A100A]/85 p-6 text-center backdrop-blur-md"
              >
                <p className="text-xs font-medium tracking-[0.18em] text-[#D4AF37]">
                  {getZoneName(altitudeKm)}
                </p>
                <h3 className="mt-2 font-serif text-3xl font-semibold text-[#FAF6EE] tabular-nums">
                  Reached {altitudeKm.toLocaleString()} km
                </h3>
                <p className="mt-1.5 text-xs text-[#D6C7B2] tabular-nums sm:text-sm">
                  ✦ {orbsCollected} Stars · 🚀 {boostsCollected} Boosts · Best:{' '}
                  {bestKm.toLocaleString()} km
                </p>
                <button
                  type="button"
                  onClick={resetAndStart}
                  className="mt-6 inline-flex min-h-[46px] items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C667] to-[#C69C2B] px-7 py-2.5 text-sm font-semibold text-[#1A100A] shadow-[0_12px_32px_-8px_rgba(212,175,55,0.55)] transition-transform active:scale-[0.98]"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Next Launch</span>
                </button>
              </motion.div>
            )}
          </div>
        </CardSpotlight>
      </HoverBorderGradient>
    </section>
  );
});
