import { useState, useEffect } from 'react';

export const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let frameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      frameId = requestAnimationFrame(() => {
        setPosition({
          x: (e.clientX / window.innerWidth - 0.5) * 2, // normalized between -1 and 1
          y: (e.clientY / window.innerHeight - 0.5) * 2,
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return position;
};
