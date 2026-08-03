import React, { useRef, useState } from 'react';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  enableTilt?: boolean;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  onClick,
  enableTilt = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);

    if (enableTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4; // Subtle physics tilt
      const rotateY = ((x - centerX) / centerX) * 4;
      setRotate({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: enableTilt
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
          : 'none',
        transition: rotate.x === 0 && rotate.y === 0 ? 'transform 0.5s ease, border-color 0.3s' : 'none'
      }}
      className={`glow-card ${className}`}
    >
      {children}
    </div>
  );
};
