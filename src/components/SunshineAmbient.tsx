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

    // Minimal floating particles
    const moteCount = 20;
    const motes: {
      x: number; y: number; vx: number; vy: number; radius: number; opacity: number; phase: number;
    }[] = [];
    for (let i = 0; i < moteCount; i++) {
      motes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.1,
        vy: -0.05 - Math.random() * 0.1, // Very slow drift upward
        radius: 0.5 + Math.random() * 2,
        opacity: 0.05 + Math.random() * 0.1, // Very transparent
        phase: Math.random() * Math.PI * 2,
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
      
      // Extremely subtle, soft top-right glow
      const sunX = width * 0.8;
      const sunY = height * 0.2;
      
      ctx.globalCompositeOperation = 'screen';
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, Math.max(width, height) * 0.5);
      sunGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      sunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'source-over';

      // Draw minimal floating motes
      for (const m of motes) {
        m.x += m.vx + Math.sin(time * 0.005 + m.phase) * 0.1;
        m.y += m.vy;

        // Wrap around
        if (m.y < -10) {
          m.y = height + 10;
          m.x = Math.random() * width;
        }
        if (m.x < -10) m.x = width + 10;
        if (m.x > width + 10) m.x = -10;

        const pulse = 0.8 + 0.2 * Math.sin(time * 0.01 + m.phase);
        const alpha = m.opacity * pulse;

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
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
