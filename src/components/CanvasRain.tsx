import React, { useEffect, useRef } from 'react';

interface RainDrop {
  x: number;
  y: number;
  vy: number;
  len: number;
  opacity: number;
}

interface CanvasRainProps {
  isFading?: boolean;
}

export const CanvasRain: React.FC<CanvasRainProps> = ({ isFading = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize raindrops
    const dropCount = 150;
    const drops: RainDrop[] = [];
    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height * 2 - height, // Start some above screen
        vy: 18 + Math.random() * 16,
        len: 14 + Math.random() * 18,
        opacity: 0.15 + Math.random() * 0.25,
      });
    }

    // Lightning parameters
    let flashIntensity = 0;
    let isFlashing = false;
    let flashFramesLeft = 0;
    const flashSequence = [0.8, 0.1, 1.0, 0.4, 0.15, 0.0];

    // Lightning bolt points for rendering
    let boltPoints: { x: number; y: number }[][] = [];

    const generateBolt = (startX: number, startY: number, endY: number, spread: number): { x: number; y: number }[] => {
      const points: { x: number; y: number }[] = [{ x: startX, y: startY }];
      const segments = 8 + Math.floor(Math.random() * 6);
      const segHeight = (endY - startY) / segments;
      
      let currentX = startX;
      for (let i = 1; i <= segments; i++) {
        currentX += (Math.random() - 0.5) * spread;
        points.push({ x: currentX, y: startY + segHeight * i });
      }
      return points;
    };

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
      // IMPORTANT: Clear the canvas completely each frame (transparent background)
      ctx.clearRect(0, 0, width, height);

      // Draw a subtle dark veil so rain is visible against any background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, width, height);

      // Draw raindrops
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];

        // Each raindrop has individual opacity for depth effect
        ctx.strokeStyle = `rgba(180, 200, 220, ${d.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        // Slightly angled rain for cinematic look
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1.5, d.y + d.len);
        ctx.stroke();

        // Update position
        d.y += d.vy;
        d.x -= 0.8; // slow drift to the left

        // Reset drop if it goes off screen
        if (d.y > height) {
          d.y = -30;
          d.x = Math.random() * width;
          d.vy = 18 + Math.random() * 16;
          d.len = 14 + Math.random() * 18;
          d.opacity = 0.15 + Math.random() * 0.25;
        }
      }

      // Handle Lightning Flash (disable if fading)
      if (!isFading && !isFlashing && Math.random() < 0.0015) {
        isFlashing = true;
        flashFramesLeft = flashSequence.length;
        document.body.classList.add('lightning-active');

        // Generate 1-3 bolt paths
        boltPoints = [];
        const boltCount = 1 + Math.floor(Math.random() * 2);
        for (let b = 0; b < boltCount; b++) {
          const startX = width * 0.2 + Math.random() * width * 0.6;
          const mainBolt = generateBolt(startX, 0, height * (0.5 + Math.random() * 0.4), 80);
          boltPoints.push(mainBolt);

          // 50% chance of a branch
          if (Math.random() > 0.5 && mainBolt.length > 3) {
            const branchIdx = 2 + Math.floor(Math.random() * (mainBolt.length - 3));
            const branchStart = mainBolt[branchIdx];
            const branch = generateBolt(branchStart.x, branchStart.y, branchStart.y + height * 0.25, 40);
            boltPoints.push(branch);
          }
        }
      }

      if (isFlashing) {
        const frameIndex = flashSequence.length - flashFramesLeft;
        flashIntensity = flashSequence[frameIndex];
        flashFramesLeft--;

        // Draw white flash overlay
        if (flashIntensity > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${flashIntensity * 0.3})`;
          ctx.fillRect(0, 0, width, height);

          // Draw lightning bolts
          for (const bolt of boltPoints) {
            if (bolt.length < 2) continue;

            // Glow layer
            ctx.strokeStyle = `rgba(200, 210, 255, ${flashIntensity * 0.6})`;
            ctx.lineWidth = 6;
            ctx.shadowColor = 'rgba(180, 200, 255, 0.8)';
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.moveTo(bolt[0].x, bolt[0].y);
            for (let p = 1; p < bolt.length; p++) {
              ctx.lineTo(bolt[p].x, bolt[p].y);
            }
            ctx.stroke();

            // Core bright line
            ctx.strokeStyle = `rgba(255, 255, 255, ${flashIntensity * 0.9})`;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.moveTo(bolt[0].x, bolt[0].y);
            for (let p = 1; p < bolt.length; p++) {
              ctx.lineTo(bolt[p].x, bolt[p].y);
            }
            ctx.stroke();
          }

          ctx.shadowBlur = 0;
          ctx.shadowColor = 'transparent';
        }

        if (flashFramesLeft <= 0) {
          isFlashing = false;
          flashIntensity = 0;
          boltPoints = [];
          document.body.classList.remove('lightning-active');
        }
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeHandler);
      document.body.classList.remove('lightning-active');
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
