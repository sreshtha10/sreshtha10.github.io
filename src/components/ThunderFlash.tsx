import React, { useEffect, useRef, useCallback } from 'react';

/**
 * ThunderFlash - A lightweight ambient lightning effect that triggers at random intervals.
 * Renders forked lightning bolts with a white screen flash overlay.
 * Designed to run persistently in Noir mode (independent of the rain intro sequence).
 */
export const ThunderFlash: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateBolt = useCallback((
    startX: number, startY: number, endY: number, spread: number
  ): { x: number; y: number }[] => {
    const points: { x: number; y: number }[] = [{ x: startX, y: startY }];
    const segments = 6 + Math.floor(Math.random() * 8);
    const segHeight = (endY - startY) / segments;
    let currentX = startX;
    for (let i = 1; i <= segments; i++) {
      currentX += (Math.random() - 0.5) * spread;
      points.push({ x: currentX, y: startY + segHeight * i });
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

    // Flash state
    let isFlashing = false;
    let flashFramesLeft = 0;
    const flashSequence = [0.6, 0.05, 0.85, 0.3, 0.1, 0.0];
    let boltPoints: { x: number; y: number }[][] = [];
    let framesSinceLastFlash = 0;

    // Random interval: flash every 6-15 seconds at 60fps
    const getNextFlashInterval = () => 360 + Math.floor(Math.random() * 540);
    let nextFlashAt = getNextFlashInterval();

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
      ctx.clearRect(0, 0, width, height);

      framesSinceLastFlash++;

      // Trigger new flash at random intervals
      if (!isFlashing && framesSinceLastFlash >= nextFlashAt) {
        isFlashing = true;
        flashFramesLeft = flashSequence.length;
        framesSinceLastFlash = 0;
        nextFlashAt = getNextFlashInterval();
        document.body.classList.add('lightning-active');

        // Generate 1-2 bolt paths
        boltPoints = [];
        const boltCount = 1 + Math.floor(Math.random() * 2);
        for (let b = 0; b < boltCount; b++) {
          const startX = width * 0.15 + Math.random() * width * 0.7;
          const mainBolt = generateBolt(startX, 0, height * (0.4 + Math.random() * 0.5), 90);
          boltPoints.push(mainBolt);

          // 40% chance of a branch bolt
          if (Math.random() > 0.6 && mainBolt.length > 3) {
            const branchIdx = 2 + Math.floor(Math.random() * (mainBolt.length - 3));
            const branchStart = mainBolt[branchIdx];
            const branch = generateBolt(
              branchStart.x, branchStart.y,
              branchStart.y + height * 0.2, 35
            );
            boltPoints.push(branch);
          }
        }
      }

      // Render active flash
      if (isFlashing) {
        const frameIndex = flashSequence.length - flashFramesLeft;
        const intensity = flashSequence[frameIndex];
        flashFramesLeft--;

        if (intensity > 0) {
          // White flash overlay
          ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.2})`;
          ctx.fillRect(0, 0, width, height);

          // Draw bolts
          for (const bolt of boltPoints) {
            if (bolt.length < 2) continue;

            // Glow pass
            ctx.strokeStyle = `rgba(200, 215, 255, ${intensity * 0.5})`;
            ctx.lineWidth = 5;
            ctx.shadowColor = 'rgba(180, 200, 255, 0.7)';
            ctx.shadowBlur = 18;
            ctx.beginPath();
            ctx.moveTo(bolt[0].x, bolt[0].y);
            for (let p = 1; p < bolt.length; p++) ctx.lineTo(bolt[p].x, bolt[p].y);
            ctx.stroke();

            // Core bright pass
            ctx.strokeStyle = `rgba(255, 255, 255, ${intensity * 0.85})`;
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.moveTo(bolt[0].x, bolt[0].y);
            for (let p = 1; p < bolt.length; p++) ctx.lineTo(bolt[p].x, bolt[p].y);
            ctx.stroke();
          }

          ctx.shadowBlur = 0;
          ctx.shadowColor = 'transparent';
        }

        if (flashFramesLeft <= 0) {
          isFlashing = false;
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
  }, [generateBolt]);

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
