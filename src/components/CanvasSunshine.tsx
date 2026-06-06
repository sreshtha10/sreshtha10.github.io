import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
}

interface CanvasSunshineProps {
  isFading?: boolean;
}

export const CanvasSunshine: React.FC<CanvasSunshineProps> = ({ isFading = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Floating warm particles (dust motes in sunlight)
    const particleCount = 40;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const maxLife = 200 + Math.random() * 300;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.3, // Float upward gently
        radius: 2 + Math.random() * 4,
        opacity: 0.2 + Math.random() * 0.25,
        hue: 35 + Math.random() * 20, // Warm golden hues
        life: Math.random() * maxLife,
        maxLife,
      });
    }

    // Sun ray parameters
    const rayCount = 8;
    const rays: { angle: number; width: number; length: number; speed: number }[] = [];
    for (let i = 0; i < rayCount; i++) {
      rays.push({
        angle: (Math.PI * 2 * i) / rayCount + Math.random() * 0.3,
        width: 0.04 + Math.random() * 0.06,
        length: 0.4 + Math.random() * 0.3,
        speed: 0.0003 + Math.random() * 0.0005,
      });
    }

    let time = 0;

    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;

    const resizeHandler = () => {
      if (!canvas) return;
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      if (Math.abs(newWidth - lastWidth) > 10 || Math.abs(newHeight - lastHeight) > 40) {
        width = canvas.width = newWidth;
        height = canvas.height = newHeight;
        lastWidth = newWidth;
        lastHeight = newHeight;
      }
    };

    window.addEventListener('resize', resizeHandler);

    const update = () => {
      time++;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle warm gradient wash from top-right
      const sunX = width * 0.85;
      const sunY = height * 0.05;
      const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, Math.max(width, height) * 0.6);
      sunGradient.addColorStop(0, 'rgba(255, 200, 50, 0.15)');
      sunGradient.addColorStop(0.3, 'rgba(255, 180, 60, 0.08)');
      sunGradient.addColorStop(1, 'rgba(255, 180, 60, 0)');
      ctx.fillStyle = sunGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw soft rotating light rays from top-right
      ctx.save();
      ctx.translate(sunX, sunY);
      for (const ray of rays) {
        const currentAngle = ray.angle + time * ray.speed;
        const rayLen = Math.max(width, height) * ray.length;

        ctx.save();
        ctx.rotate(currentAngle);

        const gradient = ctx.createLinearGradient(0, 0, rayLen, 0);
        gradient.addColorStop(0, 'rgba(255, 210, 80, 0.12)');
        gradient.addColorStop(0.5, 'rgba(255, 210, 80, 0.06)');
        gradient.addColorStop(1, 'rgba(255, 210, 80, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(rayLen, rayLen * ray.width);
        ctx.lineTo(rayLen, -rayLen * ray.width);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
      ctx.restore();

      // Draw floating warm particles
      for (const p of particles) {
        p.x += p.vx + Math.sin(time * 0.01 + p.hue) * 0.15;
        p.y += p.vy;
        p.life++;

        // Fade in and out over lifetime
        const lifeFraction = p.life / p.maxLife;
        let alpha = p.opacity;
        if (lifeFraction < 0.1) alpha *= lifeFraction / 0.1;
        if (lifeFraction > 0.85) alpha *= (1 - lifeFraction) / 0.15;

        // Reset particle when life expires or goes off-screen
        if (p.life >= p.maxLife || p.y < -20 || p.x < -20 || p.x > width + 20) {
          p.x = Math.random() * width;
          p.y = height + 10;
          p.life = 0;
          p.maxLife = 200 + Math.random() * 300;
          p.opacity = 0.2 + Math.random() * 0.25;
          continue;
        }

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, `hsla(${p.hue}, 90%, 65%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 90%, 65%, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeHandler);
    };
  }, [isFading]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 100,
        display: 'block',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 1.5s ease-out',
      }}
    />
  );
};
