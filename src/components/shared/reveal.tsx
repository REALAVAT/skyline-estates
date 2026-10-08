"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section";
}

let observer: IntersectionObserver | undefined;

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-shown", "");
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -80px 0px" },
  );
  return observer;
}

export function Reveal({ children, className, delay = 0, y = 28, as: Component = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const io = getObserver();
    io.observe(element);
    return () => io.unobserve(element);
  }, []);

  return (
    <Component
      ref={ref}
      className={cn("reveal", className)}
      style={{ "--reveal-y": `${y}px`, "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </Component>
  );
}
