import React, { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  opacity: number;
};

export const HexLogo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      width = parent.clientWidth;
      height = parent.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(26, Math.min(42, Math.round((width * height) / 6500)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: Math.random() * 1.2 + 0.45,
        opacity: Math.random() * 0.35 + 0.08
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -4 || p.x > width + 4) p.vx *= -1;
        if (p.y < -4 || p.y > height + 4) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 217, 123, ${p.opacity})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(100, 217, 123, ${0.06 * (1 - dist / 115)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      raf = window.requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement ?? canvas);
    resize();

    if (!reduceMotion) {
      draw();
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    return () => {
      ro.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="hex-logo-shell" aria-label="AK animated logo">
      <canvas ref={canvasRef} className="hex-logo-canvas" aria-hidden="true" />
      <div className="hex-logo-scan" aria-hidden="true" />
      <div className="hex-logo-corners" aria-hidden="true">
        <span className="hex-logo-corner tl" />
        <span className="hex-logo-corner tr" />
        <span className="hex-logo-corner bl" />
        <span className="hex-logo-corner br" />
      </div>
      <span className="hex-logo-hud hex-logo-hud-left">SYS::INIT</span>
      <span className="hex-logo-hud hex-logo-hud-right">v3.0.0</span>

      <div className="hex-logo-orbit hex-logo-orbit-1" aria-hidden="true">
        <span className="hex-logo-orbit-dot" />
      </div>
      <div className="hex-logo-orbit hex-logo-orbit-2" aria-hidden="true">
        <span className="hex-logo-orbit-dot" />
      </div>
      <div className="hex-logo-orbit hex-logo-orbit-3" aria-hidden="true">
        <span className="hex-logo-orbit-dot" />
      </div>

      <div className="hex-logo-center">
        <div className="hex-logo-ring hex-logo-ring-outer" aria-hidden="true" />
        <div className="hex-logo-ring hex-logo-ring-inner" aria-hidden="true" />
        <div className="hex-logo-mark" data-text="AK">
          <span className="hex-logo-mark-layer hex-logo-mark-layer-cyan" aria-hidden="true">
            AK
          </span>
          <span className="hex-logo-mark-layer hex-logo-mark-layer-magenta" aria-hidden="true">
            AK
          </span>
          <span className="hex-logo-mark-main">AK</span>
        </div>
        <div className="hex-logo-name" data-text="ABHISHEK KAUSHIK">
          ABHISHEK KAUSHIK
        </div>
        <div className="hex-logo-subtitle">
          cloud dev · kafka · rag · go · pypi author
        </div>
      </div>
    </div>
  );
};
