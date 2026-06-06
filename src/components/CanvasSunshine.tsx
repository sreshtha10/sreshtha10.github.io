import React, { useEffect, useRef } from 'react';

interface CanvasSunshineProps {
  isFading?: boolean;
}

/**
 * CanvasSunshine (Intro Effect) — A sleek, modern transition for Sunny mode.
 * Renders a crisp vertical scanline and geometric grid pulse,
 * matching the new cool & professional aesthetic.
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

      // Intro animation progression (0 to 1 over ~2 seconds)
      const progress = Math.min(time / 2000, 1);
      
      // Calculate a scanning line position
      const scanY = height * (progress * 1.5 - 0.25);

      if (progress < 1) {
        // Draw geometric grid fade-in
        ctx.strokeStyle = `rgba(79, 70, 229, ${(1 - progress) * 0.08})`; // Indigo grid
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        const gridSize = 40;
        for (let x = 0; x < width; x += gridSize) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();

        // Draw the sleek horizontal scanner
        const scanGrad = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
        scanGrad.addColorStop(0, 'rgba(13, 148, 136, 0)'); // Teal fade
        scanGrad.addColorStop(0.5, `rgba(13, 148, 136, ${(1 - progress) * 0.4})`);
        scanGrad.addColorStop(1, 'rgba(13, 148, 136, 0)');

        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanY - 50, width, 100);

        // Bright leading edge
        ctx.fillStyle = `rgba(255, 255, 255, ${(1 - progress) * 0.8})`;
        ctx.fillRect(0, scanY - 1, width, 2);
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
