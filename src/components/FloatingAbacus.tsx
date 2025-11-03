import React from 'react';
import { Calculator } from 'lucide-react';

const FloatingAbacus: React.FC = () => {
  const abacusCount = 15;
  const abacuses = Array.from({ length: abacusCount });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {abacuses.map((_, index) => (
        <div
          key={index}
          className="absolute animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${10 + Math.random() * 10}s linear infinite`,
            animationDelay: `-${Math.random() * 10}s`,
            opacity: 0.1,
          }}
        >
          <Calculator
            size={24 + Math.random() * 24}
            className="text-white transform rotate-12"
          />
        </div>
      ))}
    </div>
  );
};

export default FloatingAbacus;