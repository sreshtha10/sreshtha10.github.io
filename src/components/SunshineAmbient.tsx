import React, { useEffect, useRef } from 'react';

/**
 * SunshineAmbient — A realistic "God Rays" ambient effect for Sunny mode.
 * Renders warm volumetric light rays from the top right corner and gentle floating dust motes.
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

    // Floating warm dust motes
    const moteCount = 35;
    const motes: {
      x: number; y: number; vx: number; vy: number; radius: number; opacity: number; hue: number; phase: number;
    }[] = [];
    for (let i = 0; i < moteCount; i++) {
      motes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.1 - Math.random() * 0.2, // Drift upward
        radius: 1 + Math.random() * 3.5,
        opacity: 0.15 + Math.random() * 0.25,
        hue: 35 + Math.random() * 20, // Warm golden
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Volumetric God Rays
    const rayCount = 6;
    const rays: { angle: number; width: number; length: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < rayCount; i++) {
      rays.push({
        angle: Math.PI * 0.6 + (Math.random() * 0.3 - 0.15), // Angles pointing down and left from top right
        width: 0.05 + Math.random() * 0.08,
        length: 0.6 + Math.random() * 0.5,
        speed: (Math.random() - 0.5) * 0.0003,
        opacity: 0.04 + Math.random() * 0.06
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

      // Top right Sun glow
      const sunX = width * 0.95;
      const sunY = height * 0.05;
      
      ctx.globalCompositeOperation = 'screen';
      
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, Math.max(width, height) * 0.6);
      sunGrad.addColorStop(0, 'rgba(255, 220, 100, 0.2)');
      sunGrad.addColorStop(0.3, 'rgba(255, 200, 80, 0.08)');
      sunGrad.addColorStop(1, 'rgba(255, 200, 80, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Volumetric Rays
      ctx.save();
      ctx.translate(sunX, sunY);
      for (const ray of rays) {
        const currentAngle = ray.angle + Math.sin(time * 0.002) * ray.speed * 100;
        const rayLen = Math.max(width, height) * ray.length;

        ctx.save();
        ctx.rotate(currentAngle);

        const rayGrad = ctx.createLinearGradient(0, 0, rayLen, 0);
        rayGrad.addColorStop(0, `rgba(255, 240, 180, ${ray.opacity})`);
        rayGrad.addColorStop(0.5, `rgba(255, 220, 140, ${ray.opacity * 0.5})`);
        rayGrad.addColorStop(1, 'rgba(255, 220, 140, 0)');

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
      
      ctx.globalCompositeOperation = 'source-over';

      // Draw floating dust motes
      for (const m of motes) {
        m.x += m.vx + Math.sin(time * 0.01 + m.phase) * 0.2;
        m.y += m.vy;

        // Wrap around
        if (m.y < -10) {
          m.y = height + 10;
          m.x = Math.random() * width;
        }
        if (m.x < -10) m.x = width + 10;
        if (m.x > width + 10) m.x = -10;

        const pulse = 0.6 + 0.4 * Math.sin(time * 0.02 + m.phase);
        const alpha = m.opacity * pulse;

        const moteGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.radius);
        moteGrad.addColorStop(0, `hsla(${m.hue}, 90%, 75%, ${alpha})`);
        moteGrad.addColorStop(1, `hsla(${m.hue}, 90%, 75%, 0)`);
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
