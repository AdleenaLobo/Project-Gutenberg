import React, { useEffect, useState } from "react";

export function CherryBlossoms() {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    // Generate a set of petals with randomized properties
    const count = 55; // Increased count
    const generated = Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 16 + 10; // Larger: 10px to 26px
      const left = Math.random() * 100;
      const duration = Math.random() * 14 + 8; // Slightly faster fall: 8s to 22s
      const delay = Math.random() * -22;
      const blur = Math.random() * 1.4 + 0.1; // Sharper: 0.1px to 1.5px blur
      const opacity = Math.random() * 0.3 + 0.45; // More opaque: 0.45 to 0.75 opacity
      const rotate = Math.random() * 360;

      return {
        id: i,
        style: {
          left: `${left}%`,
          width: `${size}px`,
          height: `${size * 1.3}px`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          filter: `blur(${blur}px)`,
          opacity: opacity,
          transform: `rotate(${rotate}deg)`,
        },
      };
    });
    setPetals(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {petals.map((petal) => (
        <div key={petal.id} className="petal" style={petal.style} />
      ))}
    </div>
  );
}
