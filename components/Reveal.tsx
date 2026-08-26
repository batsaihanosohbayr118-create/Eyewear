"use client";

import { useEffect, useRef, useState } from "react";

type Direction = "up" | "right" | "left" | "down";

const OFFSETS: Record<Direction, string> = {
  up: "translateY(24px)",
  down: "translateY(-24px)",
  right: "translateX(-32px)",
  left: "translateX(32px)",
};

export default function Reveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
  duration = 700,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: Direction;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0, 0)" : OFFSETS[direction],
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}