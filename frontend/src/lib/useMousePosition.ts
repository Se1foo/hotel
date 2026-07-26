import { useEffect, useState } from 'react';

export interface MousePosition {
  /** Normalised to -1…1 relative to the viewport centre. */
  x: number;
  y: number;
}

const CENTER: MousePosition = { x: 0, y: 0 };

/**
 * A single shared mousemove subscription.
 *
 * Previously each consumer registered its own `mousemove` listener and called
 * `setState` on every animation frame — with the hook mounted in several
 * decorative components at once, one mouse movement re-rendered multiple whole
 * section subtrees. Now there is one listener and one rAF for the entire app,
 * fanned out to subscribers.
 */
let current: MousePosition = CENTER;
const subscribers = new Set<(position: MousePosition) => void>();
let frameId = 0;
let listening = false;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const handleMouseMove = (event: MouseEvent) => {
  if (frameId) return; // Coalesce to one update per frame.
  frameId = requestAnimationFrame(() => {
    frameId = 0;
    current = {
      x: (event.clientX / window.innerWidth - 0.5) * 2,
      y: (event.clientY / window.innerHeight - 0.5) * 2,
    };
    subscribers.forEach((notify) => notify(current));
  });
};

function subscribe(notify: (position: MousePosition) => void) {
  subscribers.add(notify);

  if (!listening && subscribers.size > 0) {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    listening = true;
  }

  return () => {
    subscribers.delete(notify);
    if (subscribers.size === 0 && listening) {
      window.removeEventListener('mousemove', handleMouseMove);
      listening = false;
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
    }
  };
}

/**
 * Returns the pointer position for parallax effects. Stays pinned at the centre
 * when the user has asked for reduced motion, and on touch devices where there
 * is no hover pointer at all.
 */
export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>(current);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    return subscribe(setPosition);
  }, []);

  return position;
}
