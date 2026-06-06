import React, { useEffect, useRef, useState } from 'react';
import { useCursorTrajectoryContext } from '../context/CursorTrajectoryContext';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id: string;
  variant?: 'primary' | 'secondary';
  href?: string; // If href is provided, render as an anchor link instead
  target?: string;
  download?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  id,
  children,
  variant = 'primary',
  href,
  className = '',
  style,
  ...props
}) => {
  const { registerTarget } = useCursorTrajectoryContext();
  const buttonRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  
  const [isImpending, setIsImpending] = useState(false);
  const [pull, setPull] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;

    // Register this button to the cursor trajectory listener
    const unsubscribe = registerTarget(id, el, (impending, pullX, pullY) => {
      setIsImpending(impending);
      setPull({ x: pullX, y: pullY });
    });

    return () => {
      unsubscribe();
    };
  }, [id, registerTarget]);

  const buttonStyle: React.CSSProperties = {
    ...style,
    transform: `translate3d(${pull.x}px, ${pull.y}px, 0)`,
    // Apply transition when resetting back to original position (no pull)
    // When active, do not block coordinates updates with transitions for zero-lag feeling.
    transition: pull.x === 0 && pull.y === 0 
      ? 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease, background-color 0.2s' 
      : 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease, background-color 0.2s',
  };

  const fullClassName = `btn btn-${variant} ${isImpending ? 'predictive-glow' : ''} ${className}`;

  if (href) {
    return (
      <a
        ref={buttonRef}
        href={href}
        className={fullClassName}
        style={buttonStyle}
        {...(props as any)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef}
      className={fullClassName}
      style={buttonStyle}
      {...props}
    >
      {children}
    </button>
  );
};
