import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  angle: number;
  speed: number;
}

export const TamilNaduParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const mouseRef = useRef<{ x: number; y: number; active: boolean; lastMoved: number }>({
    x: -1000,
    y: -1000,
    active: false,
    lastMoved: 0,
  });

  // Generate parametric points for the official Tamil Nadu State Crest
  // Formatted with vibrant colors that pop crisply against a white-to-green-blue gradient
  const generateTNLogoPoints = useCallback((): Point[] => {
    const points: Point[] = [];

    // Helper to generate line points
    const addLine = (x1: number, y1: number, x2: number, y2: number, count: number, color = '#047857') => {
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        points.push({ x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t, color });
      }
    };

    // 1. Outer Ring & Sun Radiance (Rich Amber Gold & Deep Emerald)
    for (let i = 0; i < 90; i++) {
      const a = (i / 90) * Math.PI * 2;
      points.push({ x: Math.cos(a) * 0.95, y: Math.sin(a) * 0.95, color: '#d97706' });
    }
    for (let i = 0; i < 70; i++) {
      const a = (i / 70) * Math.PI * 2;
      points.push({ x: Math.cos(a) * 0.88, y: Math.sin(a) * 0.88, color: '#047857' });
    }
    // 16 Radiating Sun Rays
    for (let r = 0; r < 16; r++) {
      const a = (r / 16) * Math.PI * 2;
      for (let s = 1; s <= 3; s++) {
        points.push({
          x: Math.cos(a) * (0.95 + s * 0.04),
          y: Math.sin(a) * (0.95 + s * 0.04),
          color: '#b45309',
        });
      }
    }

    // 2. Kalasams (5 temple finials on summit in deep gold)
    const kalasams = [
      { x: 0, y: -0.70, r: 0.025 },
      { x: -0.13, y: -0.67, r: 0.02 },
      { x: 0.13, y: -0.67, r: 0.02 },
      { x: -0.25, y: -0.64, r: 0.016 },
      { x: 0.25, y: -0.64, r: 0.016 },
    ];
    kalasams.forEach((k) => {
      for (let a = 0; a < 8; a++) {
        const ang = (a / 8) * Math.PI * 2;
        points.push({ x: k.x + Math.cos(ang) * k.r, y: k.y + Math.sin(ang) * k.r, color: '#d97706' });
      }
      points.push({ x: k.x, y: k.y, color: '#b45309' });
    });

    // 3. Gopuram 5 Tiers (Alternating Deep Emerald & Civic Cyan/Teal)
    const tiers = [
      { topY: -0.62, botY: -0.52, topW: 0.12, botW: 0.16 },
      { topY: -0.50, botY: -0.38, topW: 0.18, botW: 0.23 },
      { topY: -0.36, botY: -0.22, topW: 0.25, botW: 0.31 },
      { topY: -0.20, botY: -0.02, topW: 0.33, botW: 0.40 },
      { topY: 0.00, botY: 0.22, topW: 0.42, botW: 0.50 },
    ];

    tiers.forEach((tier, idx) => {
      const col = idx % 2 === 0 ? '#047857' : '#0284c7';
      // Side slopes
      addLine(-tier.topW, tier.topY, -tier.botW, tier.botY, 10, col);
      addLine(tier.topW, tier.topY, tier.botW, tier.botY, 10, col);
      // Horizontal decorative molding bands
      addLine(-tier.topW, tier.topY, tier.topW, tier.topY, 8, '#d97706');
      addLine(-tier.botW, tier.botY, tier.botW, tier.botY, 12, '#d97706');
      // Inner tier ribs
      addLine(-tier.topW * 0.5, (tier.topY + tier.botY) / 2, tier.topW * 0.5, (tier.topY + tier.botY) / 2, 6, '#059669');
    });

    // 4. Main Gateway Base
    addLine(-0.52, 0.24, -0.55, 0.54, 15, '#065f46');
    addLine(0.52, 0.24, 0.55, 0.54, 15, '#065f46');
    addLine(-0.52, 0.24, 0.52, 0.24, 20, '#d97706');

    // Base Steps / Foundation Plinths
    addLine(-0.62, 0.54, 0.62, 0.54, 25, '#d97706');
    addLine(-0.66, 0.59, 0.66, 0.59, 28, '#047857');
    addLine(-0.66, 0.54, -0.66, 0.59, 3, '#047857');
    addLine(0.66, 0.54, 0.66, 0.59, 3, '#047857');

    // 5. Sanctum Central Archway Cutout (Royal Blue)
    const archR = 0.14;
    const archCenterY = 0.38;
    for (let a = 0; a <= 12; a++) {
      const ang = Math.PI + (a / 12) * Math.PI;
      points.push({ x: Math.cos(ang) * archR, y: archCenterY + Math.sin(ang) * archR, color: '#1d4ed8' });
    }
    addLine(-archR, archCenterY, -archR, 0.54, 8, '#1d4ed8');
    addLine(archR, archCenterY, archR, 0.54, 8, '#1d4ed8');

    // 6. Ashoka Chakra inside Arch (Sapphire & Cyan)
    const chakraY = 0.43;
    const chakraR = 0.07;
    for (let a = 0; a < 24; a++) {
      const ang = (a / 24) * Math.PI * 2;
      points.push({ x: Math.cos(ang) * chakraR, y: chakraY + Math.sin(ang) * chakraR, color: '#1e40af' });
    }
    points.push({ x: 0, y: chakraY, color: '#0369a1' });
    // Spokes
    for (let s = 0; s < 8; s++) {
      const ang = (s / 8) * Math.PI * 2;
      points.push({ x: Math.cos(ang) * (chakraR * 0.5), y: chakraY + Math.sin(ang) * (chakraR * 0.5), color: '#0284c7' });
    }

    return points;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const logoPoints = generateTNLogoPoints();
    const particleCount = logoPoints.length;

    // Ambient floating palette
    const ambientColors = ['#047857', '#059669', '#0284c7', '#1d4ed8', '#d97706', '#0f766e'];

    // Initialize particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const p = logoPoints[i];
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      particles.push({
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        baseX: startX,
        baseY: startY,
        targetX: startX,
        targetY: startY,
        size: Math.random() * 2.2 + 1.6,
        color: p.color || ambientColors[i % ambientColors.length],
        alpha: Math.random() * 0.35 + 0.55,
        baseAlpha: Math.random() * 0.35 + 0.55,
        angle: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03,
      });
    }

    // Responsive resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse & Touch interaction handlers
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
      mouseRef.current.lastMoved = Date.now();
      setIsInteracting(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
        mouseRef.current.active = true;
        mouseRef.current.lastMoved = Date.now();
        setIsInteracting(true);
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    // Main animation loop
    let morphFactor = 0; // 0 = ambient drifting, 1 = full Tamil Nadu emblem formation

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const now = Date.now();
      const timeSinceMouse = now - mouseRef.current.lastMoved;
      // Active if locked OR recently moved mouse (within 5.5 seconds)
      const shouldFormLogo = isLocked || (mouseRef.current.active && timeSinceMouse < 5500);

      // Smoothly animate morph factor
      if (shouldFormLogo) {
        morphFactor += (1 - morphFactor) * 0.05;
        if (!isInteracting && morphFactor > 0.05) setIsInteracting(true);
      } else {
        morphFactor += (0 - morphFactor) * 0.025;
        if (isInteracting && morphFactor < 0.05) setIsInteracting(false);
      }

      // Responsive emblem radius: scales elegantly on laptop, tablet, or monitor
      const emblemRadius = Math.min(width, height) * 0.38;
      const centerX = width / 2;
      const centerY = height / 2;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        const targetPt = logoPoints[i];

        // Logo coordinate mapped to screen
        const logoScreenX = centerX + targetPt.x * emblemRadius;
        const logoScreenY = centerY + targetPt.y * emblemRadius;

        // Ambient drifting motion
        p.angle += p.speed;
        p.baseX += p.vx + Math.sin(p.angle) * 0.35;
        p.baseY += p.vy + Math.cos(p.angle) * 0.35;

        // Wrap around borders in ambient mode
        if (p.baseX < 0) p.baseX = width;
        if (p.baseX > width) p.baseX = 0;
        if (p.baseY < 0) p.baseY = height;
        if (p.baseY > height) p.baseY = 0;

        // Interpolate between ambient floating position and TN Logo formation
        const destX = p.baseX * (1 - morphFactor) + logoScreenX * morphFactor;
        const destY = p.baseY * (1 - morphFactor) + logoScreenY * morphFactor;

        // Interactive mouse magnetic ripple when close
        let mouseDisplaceX = 0;
        let mouseDisplaceY = 0;
        if (mouseRef.current.active) {
          const dx = destX - mouseRef.current.x;
          const dy = destY - mouseRef.current.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = 140;
          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 35;
            mouseDisplaceX = (dx / dist) * force;
            mouseDisplaceY = (dy / dist) * force;
          }
        }

        // Smooth physics towards destination
        p.x += (destX + mouseDisplaceX - p.x) * 0.12;
        p.y += (destY + mouseDisplaceY - p.y) * 0.12;

        // Alpha and crispness
        const currentAlpha = p.baseAlpha * (1 - morphFactor) + (0.92 + Math.sin(p.angle * 2) * 0.08) * morphFactor;

        // Draw particle
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 + morphFactor * 0.35), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = morphFactor > 0.4 ? 10 : 3;
        ctx.fill();
        ctx.restore();
      }

      // Draw subtle connecting constellation lines between nearby particles when emblem is formed
      if (morphFactor > 0.55) {
        ctx.save();
        ctx.lineWidth = 0.7;
        const maxLinkDist = emblemRadius * 0.11;
        const lineAlpha = (morphFactor - 0.55) * 0.55;
        ctx.globalAlpha = lineAlpha;

        for (let i = 0; i < particleCount; i += 3) {
          const p1 = particles[i];
          for (let j = i + 1; j < Math.min(i + 15, particleCount); j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            if (dist < maxLinkDist) {
              ctx.strokeStyle = p1.color;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [generateTNLogoPoints, isLocked]);

  return (
    <>
      {/* Background Canvas with White into Green-Blue Gradient */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, #ffffff 0%, #f0fdf9 30%, #ecfdf5 55%, #e0f2fe 80%, #bae6fd 100%)',
        }}
      />

      {/* Interactive Helper Pill in Bottom Right corner */}
      <div className="fixed bottom-4 right-4 z-40 hidden sm:flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => {
            setIsLocked(!isLocked);
            mouseRef.current.active = true;
            mouseRef.current.lastMoved = Date.now();
          }}
          className={`px-3.5 py-2 rounded-full text-xs font-bold backdrop-blur-xl border shadow-xl transition-all flex items-center gap-2 cursor-pointer ${
            isLocked || isInteracting
              ? 'bg-emerald-900/90 text-white border-emerald-400 shadow-emerald-900/40 scale-105'
              : 'bg-white/85 text-slate-800 border-emerald-300 hover:border-emerald-500 hover:bg-white shadow-sm'
          }`}
          title="Move your mouse anywhere or click to assemble the particles into the Tamil Nadu Government Emblem"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span>
            {isLocked
              ? 'தமிழ்நாடு சின்னம் வடிவம் (Locked)'
              : isInteracting
              ? 'தமிழ்நாடு அரசு சின்னம் (Active)'
              : 'நகர்த்தினால் தமிழ்நாடு சின்னம் தோன்றும் (Move mouse to form logo)'}
          </span>
        </button>
      </div>
    </>
  );
};
