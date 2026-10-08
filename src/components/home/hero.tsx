import Image from "next/image";
import { ChevronDown, Star } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { img } from "@/data/images";
import { HeroSearch } from "./hero-search";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-navy pt-28 pb-14 sm:items-center sm:pb-20">
      <Image
        src={img.skylineSunset}
        alt=""
        fill
        priority
        fetchPriority="high"
        quality={50}
        sizes="100vw"
        className="-z-10 animate-[heroZoom_22s_ease-out_forwards] object-cover object-[60%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/70 via-navy/35 to-navy/85" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgb(11_31_58/0.65),transparent_60%)] rtl:bg-[radial-gradient(ellipse_at_top_right,rgb(11_31_58/0.65),transparent_60%)]" />

      <div className="container-luxe flex flex-col items-start gap-10">
        <div className="max-w-3xl text-white">
          <p className="eyebrow animate-[fadeUp_0.9s_var(--ease-luxe)_both] text-gold-light">{t("eyebrow")}</p>
          <h1 className="mt-6 animate-[fadeUp_0.9s_0.1s_var(--ease-luxe)_both] font-display text-[2.9rem] leading-[0.98] font-medium text-white sm:text-7xl lg:text-[5.75rem] rtl:text-5xl rtl:leading-tight rtl:font-semibold rtl:sm:text-6xl rtl:lg:text-7xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl animate-[fadeUp_0.9s_0.2s_var(--ease-luxe)_both] text-base leading-relaxed text-white/85 sm:text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="w-full animate-[fadeUp_0.9s_0.3s_var(--ease-luxe)_both]">
          <HeroSearch />
        </div>

        <div className="flex animate-[fadeUp_0.9s_0.4s_var(--ease-luxe)_both] items-center gap-3 text-sm text-white/85">
          <span className="flex text-gold" aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="size-4 fill-current" />
            ))}
          </span>
          {t("trust")}
        </div>
      </div>

      <a
        href="#featured"
        aria-label={t("scroll")}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] tracking-[0.25em] text-white/70 uppercase transition-colors hover:text-white lg:flex rtl:tracking-normal"
      >
        <ChevronDown className="size-5 animate-bounce" aria-hidden="true" />
      </a>
    </section>
  );
}
