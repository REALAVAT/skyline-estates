"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 1800;
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));

export function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  locale,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  locale: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setValue(to);
          return;
        }
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / DURATION, 1);
          setValue(to * easeOutExpo(progress));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: "-40px" },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to]);

  const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-AE-u-nu-latn" : "en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return (
    <span ref={ref} dir="ltr" className="inline-block tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
