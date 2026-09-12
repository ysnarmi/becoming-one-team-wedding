"use client";

import { useEffect, useRef } from "react";

interface Props {
  count?: number; // 총 눈송이 개수
}

interface Flake {
  el: HTMLDivElement;
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  driftSpeed: number;
  angle: number;
}

export default function FallingSnow({ count = 30 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const flakes = useRef<Flake[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const h = container.clientHeight || 600;

    const createFlake = (initialY?: number): Flake => {
      const size = 3 + Math.random() * 5;
      const blur = 1 + Math.random() * 2.5;
      const el = document.createElement("div");
      el.style.cssText = `
        position:absolute;
        width:${size}px;
        height:${size}px;
        border-radius:50%;
        background:#fff;
        box-shadow:0 0 ${size * 1.5}px rgba(255,255,255,0.8);
        filter:blur(${blur}px);
        pointer-events:none;
        user-select:none;
        opacity:${0.4 + Math.random() * 0.4};
        z-index:99;
      `;
      container.appendChild(el);
      return {
        el,
        x: Math.random() * 100, // % of container width
        y: initialY ?? -(size + Math.random() * h),
        size,
        speed: 0.7 + Math.random() * 0.8,
        drift: 1 + Math.random() * 1.5,
        driftSpeed: 0.3 + Math.random() * 0.5,
        angle: Math.random() * Math.PI * 2,
      };
    };

    for (let i = 0; i < count; i++) {
      flakes.current.push(createFlake(Math.random() * h));
    }

    const tick = () => {
      const ch = container.clientHeight;

      flakes.current.forEach((f) => {
        f.y += f.speed;
        f.angle += f.driftSpeed * 0.016;
        const dx = Math.sin(f.angle) * f.drift;

        f.el.style.left = `${f.x + dx}%`;
        f.el.style.top = `${f.y}px`;

        if (f.y > ch + f.size) {
          f.y = -f.size;
          f.x = Math.random() * 100;
        }
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      flakes.current.forEach((f) => f.el.remove());
      flakes.current = [];
    };
  }, [count]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 99,
      }}
    />
  );
}
