import React, { useEffect, useRef } from 'react';

interface FloatingMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  hue: number;
  phase: number;
}

/**
 * SunshineAmbient — A persistent, subtle warm ambient effect for Sunny mode.
 * Renders gently floating golden dust particles and slow-rotating light rays.
 * Designed to run continuously while in Sunny theme (independent of the intro effect).
 */
export const SunshineAmbient: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Floating warm particles (golden dust motes)
    const moteCount = 25;
    const motes: FloatingMote[] = [];
    for (let i = 0; i < moteCount; i++) {
      motes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.1 - Math.random() * 0.15,
        radius: 1.5 + Math.random() * 3,
        opacity: 0.25 + Math.random() * 0.35,
        hue: 35 + Math.random() * 25,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Soft light rays from top-right
    const rayCount = 5;
    const rays: { angle: number; width: number; length: number; speed: number }[] = [];
    for (let i = 0; i < rayCount; i++) {
      rays.push({
        angle: -0.4 + (Math.PI * 0.6 * i) / rayCount + Math.random() * 0.15,
        width: 0.03 + Math.random() * 0.04,
        length: 0.35 + Math.random() * 0.25,
        speed: 0.00015 + Math.random() * 0.0003,
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

      // Subtle warm radial gradient from top-right corner
      const sunX = width * 0.9;
      const sunY = height * 0.02;
      const gradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, Math.max(width, height) * 0.5);
      gradient.addColorStop(0, 'rgba(255, 200, 50, 0.12)');
      gradient.addColorStop(0.4, 'rgba(255, 180, 30, 0.06)');
      gradient.addColorStop(1, 'rgba(255, 180, 30, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw light rays
      ctx.save();
      ctx.translate(sunX, sunY);
      for (const ray of rays) {
        const currentAngle = ray.angle + time * ray.speed;
        const rayLen = Math.max(width, height) * ray.length;

        ctx.save();
        ctx.rotate(currentAngle);

        const rayGrad = ctx.createLinearGradient(0, 0, rayLen, 0);
        rayGrad.addColorStop(0, 'rgba(255, 200, 50, 0.1)');
        rayGrad.addColorStop(0.6, 'rgba(255, 200, 50, 0.04)');
        rayGrad.addColorStop(1, 'rgba(255, 200, 50, 0)');

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(rayLen, rayLen * ray.width);
        ctx.lineTo(rayLen, -rayLen * ray.width);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
      ctx.restore();

      // Draw floating motes
      for (const m of motes) {
        // Gentle sine-wave drift
        m.x += m.vx + Math.sin(time * 0.008 + m.phase) * 0.1;
        m.y += m.vy;

        // Wrap around when going off-screen
        if (m.y < -10) {
          m.y = height + 10;
          m.x = Math.random() * width;
        }
        if (m.x < -10) m.x = width + 10;
        if (m.x > width + 10) m.x = -10;

        // Pulsing opacity
        const pulse = 0.7 + 0.3 * Math.sin(time * 0.015 + m.phase);
        const alpha = m.opacity * pulse;

        const moteGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.radius);
        moteGrad.addColorStop(0, `hsla(${m.hue}, 90%, 65%, ${alpha})`);
        moteGrad.addColorStop(1, `hsla(${m.hue}, 90%, 65%, 0)`);
        ctx.fillStyle = moteGrad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

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
      }}
    />
  );
};
