import React, { useEffect, useRef } from 'react';

/**
 * SunshineAmbient — A sleek, modern ambient effect for Sunny mode.
 * Renders slow-moving, large, highly-blurred gradient orbs (Indigo & Teal)
 * to give a premium, professional SaaS aesthetic.
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

    // Modern SaaS Colors: Indigo (#4F46E5) and Teal (#0D9488)
    const orbs = [
      {
        x: width * 0.2, y: height * 0.2,
        baseX: width * 0.2, baseY: height * 0.2,
        radius: Math.max(width, height) * 0.4,
        speedX: 0.0005, speedY: 0.0007,
        phaseX: 0, phaseY: Math.PI / 2,
        colorCenter: 'rgba(79, 70, 229, 0.08)', // Indigo
        colorEdge: 'rgba(79, 70, 229, 0)'
      },
      {
        x: width * 0.8, y: height * 0.8,
        baseX: width * 0.8, baseY: height * 0.8,
        radius: Math.max(width, height) * 0.45,
        speedX: 0.0006, speedY: 0.0004,
        phaseX: Math.PI, phaseY: Math.PI / 4,
        colorCenter: 'rgba(13, 148, 136, 0.06)', // Teal
        colorEdge: 'rgba(13, 148, 136, 0)'
      },
      {
        x: width * 0.5, y: height * 0.5,
        baseX: width * 0.5, baseY: height * 0.5,
        radius: Math.max(width, height) * 0.5,
        speedX: 0.0004, speedY: 0.0005,
        phaseX: Math.PI / 3, phaseY: Math.PI * 1.5,
        colorCenter: 'rgba(99, 102, 241, 0.05)', // Lighter Indigo
        colorEdge: 'rgba(99, 102, 241, 0)'
      }
    ];

    // Subtle data nodes (clean tech vibe)
    const nodes: { x: number; y: number; speed: number; alpha: number }[] = [];
    for (let i = 0; i < 15; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.1 + Math.random() * 0.2,
        alpha: 0.05 + Math.random() * 0.1
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
        
        // Update orb bases
        orbs[0].baseX = width * 0.2; orbs[0].baseY = height * 0.2;
        orbs[1].baseX = width * 0.8; orbs[1].baseY = height * 0.8;
        orbs[2].baseX = width * 0.5; orbs[2].baseY = height * 0.5;
        
        lastWidth = newWidth;
        lastHeight = newHeight;
      }
    };

    window.addEventListener('resize', resizeHandler);

    const update = () => {
      time += 16; // Approx 16ms per frame
      ctx.clearRect(0, 0, width, height);

      // Draw floating gradient orbs
      ctx.globalCompositeOperation = 'screen';
      for (const orb of orbs) {
        orb.x = orb.baseX + Math.sin(time * orb.speedX + orb.phaseX) * (width * 0.15);
        orb.y = orb.baseY + Math.cos(time * orb.speedY + orb.phaseY) * (height * 0.15);

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        gradient.addColorStop(0, orb.colorCenter);
        gradient.addColorStop(1, orb.colorEdge);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';

      // Draw subtle tech nodes moving upwards
      ctx.fillStyle = 'rgba(79, 70, 229, 0.4)'; // Indigo dot
      for (const node of nodes) {
        node.y -= node.speed;
        if (node.y < -10) {
          node.y = height + 10;
          node.x = Math.random() * width;
        }

        ctx.globalAlpha = node.alpha;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

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
