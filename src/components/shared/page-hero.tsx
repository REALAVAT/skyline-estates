import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";

export function PageHero({
  locale,
  crumbs,
  eyebrow,
  title,
  subtitle,
  image,
  children,
  size = "md",
}: {
  locale: Locale;
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
  children?: ReactNode;
  size?: "md" | "lg";
}) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-navy", image ? "text-white" : "")}>
      {image && (
        <>
          <Image src={image} alt="" fill priority quality={45} sizes="100vw" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy via-navy/70 to-navy/30" />
        </>
      )}
      <div
        className={cn(
          "container-luxe flex flex-col justify-end",
          size === "lg" ? "min-h-[440px] py-14 sm:min-h-[520px] sm:py-16" : "min-h-[320px] py-12 sm:min-h-[380px] sm:py-14",
        )}
      >
        <Breadcrumbs items={crumbs} locale={locale} light className="mb-auto pb-10" />
        <div className="max-w-3xl">
          {eyebrow && <p className="eyebrow text-gold-light">{eyebrow}</p>}
          <h1 className="mt-4 font-display text-4xl leading-[1.08] font-medium text-white sm:text-5xl lg:text-6xl rtl:leading-tight rtl:font-semibold">
            {title}
          </h1>
          {subtitle && <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">{subtitle}</p>}
        </div>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
