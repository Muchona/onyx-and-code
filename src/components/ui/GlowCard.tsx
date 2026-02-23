import React, { useEffect, useRef, type ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  baseHue?: number;
  spread?: number;
}

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(212, 175, 55, 0.15)', // Default to gold-accent
  baseHue = 45, // Gold hue
  spread = 50
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncPointer = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;

      if (cardRef.current) {
        // Use global coordinates for fixed background effect
        cardRef.current.style.setProperty('--x', x.toFixed(2));
        cardRef.current.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty('--y', y.toFixed(2));
        cardRef.current.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
      }
    };

    window.addEventListener('pointermove', syncPointer);
    return () => window.removeEventListener('pointermove', syncPointer);
  }, []);

  const beforeAfterStyles = `
    .glow-card::before,
    .glow-card::after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: -1px;
      border: 1px solid transparent;
      border-radius: inherit;
      background-attachment: fixed;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: 50% 50%;
      mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
      z-index: 2;
    }
    
    .glow-card::before {
      background-image: radial-gradient(
        150px 150px at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        ${glowColor}, transparent 100%
      );
      filter: brightness(1.5);
    }
    
    .glow-card::after {
      background-image: radial-gradient(
        100px 100px at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        rgba(255, 255, 255, 0.3), transparent 100%
      );
    }
  `;

  return (
    <div
      ref={cardRef}
      className={`glow-card relative group ${className}`}
      style={{
        '--base-hue': baseHue,
        '--spread': spread,
      } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{ __html: beforeAfterStyles }} />
      {/* Internal spotlight layer */}
      <div
        className="absolute inset-0 z-0 pointer-events-none rounded-[inherit]"
        style={{
          backgroundImage: `radial-gradient(
            300px 300px at
            calc(var(--x, 0) * 1px)
            calc(var(--y, 0) * 1px),
            ${glowColor}, transparent
          )`,
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
};

export default GlowCard;
