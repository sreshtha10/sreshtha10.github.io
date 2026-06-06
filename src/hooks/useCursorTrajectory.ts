import { useEffect, useRef, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Velocity {
  vx: number; // px per ms
  vy: number; // px per ms
}

interface BoundingBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

// Check if a line segment between p1 and p2 intersects a bounding box
function lineSegmentIntersectsBox(p1: Point, p2: Point, box: BoundingBox): boolean {
  // 1. Quick boundary check
  const segMinX = Math.min(p1.x, p2.x);
  const segMaxX = Math.max(p1.x, p2.x);
  const segMinY = Math.min(p1.y, p2.y);
  const segMaxY = Math.max(p1.y, p2.y);

  if (segMaxX < box.left || segMinX > box.right || segMaxY < box.top || segMinY > box.bottom) {
    return false;
  }

  // 2. If the start point is already inside the box
  if (p1.x >= box.left && p1.x <= box.right && p1.y >= box.top && p1.y <= box.bottom) {
    return true;
  }

  // 3. Line intersection checks with the 4 boundaries of the box
  // Line equations: P(t) = p1 + t * (p2 - p1), for t in [0, 1]
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  // Check intersection with vertical lines: x = left, x = right
  if (dx !== 0) {
    // Left boundary
    const tLeft = (box.left - p1.x) / dx;
    if (tLeft >= 0 && tLeft <= 1) {
      const yIntersect = p1.y + tLeft * dy;
      if (yIntersect >= box.top && yIntersect <= box.bottom) return true;
    }

    // Right boundary
    const tRight = (box.right - p1.x) / dx;
    if (tRight >= 0 && tRight <= 1) {
      const yIntersect = p1.y + tRight * dy;
      if (yIntersect >= box.top && yIntersect <= box.bottom) return true;
    }
  }

  // Check intersection with horizontal lines: y = top, y = bottom
  if (dy !== 0) {
    // Top boundary
    const tTop = (box.top - p1.y) / dy;
    if (tTop >= 0 && tTop <= 1) {
      const xIntersect = p1.x + tTop * dx;
      if (xIntersect >= box.left && xIntersect <= box.right) return true;
    }

    // Bottom boundary
    const tBottom = (box.bottom - p1.y) / dy;
    if (tBottom >= 0 && tBottom <= 1) {
      const xIntersect = p1.x + tBottom * dx;
      if (xIntersect >= box.left && xIntersect <= box.right) return true;
    }
  }

  return false;
}

export function useCursorTrajectory() {
  const lastPos = useRef<Point>({ x: 0, y: 0 });
  const lastTime = useRef<number>(0);
  const velocity = useRef<Velocity>({ vx: 0, vy: 0 });
  
  // Track registered target elements for predictive glow
  const targets = useRef<Map<string, { element: HTMLElement; callback: (isImpending: boolean, pullX: number, pullY: number) => void }>>(new Map());

  const registerTarget = useCallback((id: string, element: HTMLElement, callback: (isImpending: boolean, pullX: number, pullY: number) => void) => {
    targets.current.set(id, { element, callback });
    return () => {
      targets.current.delete(id);
    };
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const currentTime = performance.now();
      const dt = currentTime - lastTime.current;
      const currentPos = { x: e.clientX, y: e.clientY };

      if (dt > 0) {
        // Calculate velocity (pixels per ms)
        const vx = (currentPos.x - lastPos.current.x) / dt;
        const vy = (currentPos.y - lastPos.current.y) / dt;
        
        velocity.current = { vx, vy };

        // Project cursor position 400ms into the future
        const lookaheadTime = 400; // ms
        const predictedPos = {
          x: currentPos.x + vx * lookaheadTime,
          y: currentPos.y + vy * lookaheadTime,
        };

        // Evaluate prediction for each registered element
        targets.current.forEach((target) => {
          const rect = target.element.getBoundingClientRect();
          const box: BoundingBox = {
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
          };

          // 1. Predict intersection
          // If speed is extremely small, do not trigger trajectory prediction (prevents noise when stationary)
          const speed = Math.sqrt(vx * vx + vy * vy);
          const isImpending = speed > 0.1 ? lineSegmentIntersectsBox(currentPos, predictedPos, box) : false;

          // 2. Magnetic Pull Calculation
          // Find center of the button
          const buttonCenterX = box.left + box.width / 2;
          const buttonCenterY = box.top + box.height / 2;

          const dx = currentPos.x - buttonCenterX;
          const dy = currentPos.y - buttonCenterY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let pullX = 0;
          let pullY = 0;

          const magnetRange = 120; // range in px
          if (distance < magnetRange) {
            // Stronger pull as it gets closer
            const strength = (1 - distance / magnetRange); // 0 to 1
            const maxPull = 15; // max translate px
            // Calculate pull vector (towards cursor)
            pullX = -dx * strength * 0.15;
            pullY = -dy * strength * 0.15;
            
            // Cap the pull
            const pullDistance = Math.sqrt(pullX * pullX + pullY * pullY);
            if (pullDistance > maxPull) {
              const angle = Math.atan2(pullY, pullX);
              pullX = Math.cos(angle) * maxPull;
              pullY = Math.sin(angle) * maxPull;
            }
          }

          target.callback(isImpending, pullX, pullY);
        });
      }

      lastPos.current = currentPos;
      lastTime.current = currentTime;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return { registerTarget };
}
