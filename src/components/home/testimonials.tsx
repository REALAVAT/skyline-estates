"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { testimonials } from "@/data/testimonials";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const t = useTranslations("home");
  const locale = useLocale();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;
  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => go(1), 7000);
    return () => window.clearInterval(timer);
  }, [go, paused]);

  const current = testimonials[index];

  return (
    <section
      className="bg-ivory py-24 lg:py-32"
      aria-roledescription="carousel"
      aria-label={t("testimonialsTitle")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container-luxe">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">{t("testimonialsEyebrow")}</p>
          <h2 className="section-title mt-4">{t("testimonialsTitle")}</h2>

          <div className="relative mt-14 min-h-[320px] sm:min-h-[280px]">
            <Quote className="mx-auto size-10 text-gold rtl:-scale-x-100" aria-hidden="true" />
            <figure key={current.id} className="animate-[fadeUp_0.6s_var(--ease-luxe)_both]" aria-live="polite">
                <blockquote className="mt-6 font-display text-2xl leading-snug text-navy sm:text-3xl lg:text-[2.1rem] rtl:text-xl rtl:leading-relaxed rtl:sm:text-2xl">
                  &ldquo;{current.quote[locale]}&rdquo;
                </blockquote>
                <figcaption className="mt-10 flex items-center justify-center gap-4">
                  <span className="relative size-14 overflow-hidden rounded-full ring-2 ring-gold/60 ring-offset-2 ring-offset-ivory">
                    <Image src={current.avatar} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                  <span className="text-start">
                    <span className="block font-semibold text-navy">{current.name}</span>
                    <span className="block text-sm text-muted-foreground">{current.role[locale]}</span>
                    <span className="mt-1 flex text-gold" role="img" aria-label={`${current.rating}/5`}>
                      {Array.from({ length: current.rating }, (_, i) => (
                        <Star key={i} className="size-3.5 fill-current" aria-hidden="true" />
                      ))}
                    </span>
                  </span>
                </figcaption>
            </figure>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6">
            <button type="button" onClick={() => go(-1)} aria-label={t("previous")} className="grid size-11 place-items-center rounded-full border border-navy/15 text-navy transition-colors hover:bg-navy hover:text-ivory">
              <ChevronLeft className="size-5 rtl-flip" aria-hidden="true" />
            </button>
            <div className="flex">
              {testimonials.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={t("goToSlide", { index: i + 1 })}
                  aria-current={i === index ? "true" : undefined}
                  className="grid h-6 min-w-6 place-items-center px-1"
                >
                  <span className={cn("block h-1.5 rounded-full bg-navy transition-all duration-300", i === index ? "w-8" : "w-1.5 opacity-25")} />
                </button>
              ))}
            </div>
            <button type="button" onClick={() => go(1)} aria-label={t("next")} className="grid size-11 place-items-center rounded-full border border-navy/15 text-navy transition-colors hover:bg-navy hover:text-ivory">
              <ChevronRight className="size-5 rtl-flip" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
