import React, { useEffect, useRef } from 'react';

interface CanvasSunshineProps {
  isFading?: boolean;
}

/**
 * CanvasSunshine (Intro Effect) — A bright, warm "sunrise" flash.
 * Renders an intense burst of sunlight that gracefully fades out
 * to reveal the ambient God Rays.
 */
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
      time += 16;
      ctx.clearRect(0, 0, width, height);

      // Intro animation progression
      const progress = Math.min(time / 2000, 1);
      
      // Intense white/gold flash that dissipates
      if (progress < 1) {
        const sunX = width * 0.95;
        const sunY = height * 0.05;
        
        ctx.globalCompositeOperation = 'screen';
        
        // Main intense flash
        const flashAlpha = (1 - progress) * 0.8;
        const flashGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, Math.max(width, height) * 1.5);
        flashGrad.addColorStop(0, `rgba(255, 255, 255, ${flashAlpha})`);
        flashGrad.addColorStop(0.3, `rgba(255, 240, 180, ${flashAlpha * 0.7})`);
        flashGrad.addColorStop(1, 'rgba(255, 200, 100, 0)');
        
        ctx.fillStyle = flashGrad;
        ctx.fillRect(0, 0, width, height);
        
        // Expanding sun ring
        const ringRadius = progress * Math.max(width, height) * 0.8;
        ctx.beginPath();
        ctx.arc(sunX, sunY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 220, 100, ${(1 - progress) * 0.4})`;
        ctx.lineWidth = 40 * (1 - progress);
        ctx.stroke();
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
        zIndex: 110,
        display: 'block',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 1.5s ease-out',
      }}
    />
  );
};
