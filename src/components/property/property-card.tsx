"use client";

import { useState } from "react";
import Image from "next/image";
import { Bath, BedDouble, ChevronLeft, ChevronRight, MapPin, Maximize } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Price } from "@/components/shared/price";
import { areaNames } from "@/data/area-names";
import { Link } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PropertySummary } from "@/types";
import { CompareButton } from "./compare-button";
import { FavoriteButton } from "./favorite-button";

interface PropertyCardProps {
  property: PropertySummary;
  layout?: "grid" | "list";
  highlighted?: boolean;
  priority?: boolean;
  sizes?: string;
  onHoverChange?: (id: string | null) => void;
  className?: string;
}

const MAX_SLIDES = 5;

export function PropertyCard({
  property,
  layout = "grid",
  highlighted,
  priority,
  sizes = "(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw",
  onHoverChange,
  className,
}: PropertyCardProps) {
  const locale = useLocale();
  const t = useTranslations("common");
  const tt = useTranslations("types");
  const [index, setIndex] = useState(0);
  const [armed, setArmed] = useState(false);
  const areaName = areaNames[property.area];
  const slides = property.images.slice(0, MAX_SLIDES);
  const title = property.title[locale];
  const isList = layout === "list";

  const go = (delta: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setArmed(true);
    setIndex((i) => (i + delta + slides.length) % slides.length);
  };

  return (
    <article
      id={`property-${property.id}`}
      onMouseEnter={() => {
        setArmed(true);
        onHoverChange?.(property.id);
      }}
      onMouseLeave={() => onHoverChange?.(null)}
      onFocus={() => setArmed(true)}
      className={cn(
        "group relative flex overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-navy/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift",
        isList ? "flex-col sm:flex-row" : "flex-col",
        highlighted && "ring-2 ring-gold",
        className,
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-sand",
          isList ? "aspect-[4/3] sm:aspect-auto sm:w-[42%] sm:min-h-64" : "aspect-[4/3]",
        )}
      >
        {slides.map((src, i) => {
          if (i > 0 && !armed) return null;
          return (
            <Image
              key={src + i}
              src={src}
              alt={t("photoAlt", { title, index: i + 1 })}
              fill
              sizes={sizes}
              priority={priority && i === 0}
              className={cn(
                "object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-luxe)] group-hover:scale-[1.04]",
                i === index ? "opacity-100" : "opacity-0",
              )}
            />
          );
        })}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/55 via-transparent to-navy/10" />

        <div className="absolute start-3 top-3 z-10 flex flex-wrap gap-1.5">
          {property.featured && (
            <span className="rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold tracking-wide text-navy">
              {t("featured")}
            </span>
          )}
          {property.completion === "off-plan" ? (
            <span className="rounded-full bg-navy/85 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
              {t("offPlanBadge")}
            </span>
          ) : (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-navy backdrop-blur">
              {property.purpose === "rent" ? t("forRent") : t("forSale")}
            </span>
          )}
        </div>

        <div className="absolute end-3 top-3 z-10 flex gap-2">
          <CompareButton id={property.id} />
          <FavoriteButton id={property.id} />
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={go(-1)}
              aria-label={t("previousImage")}
              className="absolute start-3 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy opacity-100 shadow-soft transition-opacity duration-300 focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronLeft className="size-4 rtl-flip" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={go(1)}
              aria-label={t("nextImage")}
              className="absolute end-3 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy opacity-100 shadow-soft transition-opacity duration-300 focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronRight className="size-4 rtl-flip" aria-hidden="true" />
            </button>
            <div
              className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5"
              aria-label={t("imageCounter", { current: index + 1, total: slides.length })}
              role="img"
            >
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full bg-white transition-all duration-300",
                    i === index ? "w-5" : "w-1.5 opacity-60",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col p-5", isList && "sm:p-7")}>
        <div className="flex items-center justify-between gap-3">
          <Price
            aed={property.price}
            purpose={property.purpose}
            className="font-display text-2xl font-semibold text-navy rtl:text-xl"
          />
          <span className="shrink-0 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {tt(property.type)}
          </span>
        </div>
        <h3 className="mt-2 line-clamp-2 font-sans text-[15px] leading-snug font-semibold text-ink">
          <Link
            href={`/properties/${property.slug}`}
            className="outline-none after:absolute after:inset-0 after:z-0 after:content-[''] focus-visible:after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-gold"
          >
            {title}
          </Link>
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0 text-gold-deep" aria-hidden="true" />
          <span className="truncate">
            {[property.building[locale], areaName?.[locale]].filter(Boolean).join(locale === "ar" ? "، " : ", ")}
          </span>
        </p>
        {isList && property.excerpt && (
          <p className="mt-4 line-clamp-2 hidden text-sm leading-relaxed text-muted-foreground sm:block">
            {property.excerpt[locale]}
          </p>
        )}
        <div className="min-h-4 flex-1" />
        <dl className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-navy/5 pt-4 text-sm text-ink/80 [&_dd]:flex [&_dd]:items-center [&_dd]:gap-1.5">
          <div>
            <dt className="sr-only">{t("bedsShort")}</dt>
            <dd>
              <BedDouble className="size-4 text-gold-deep" aria-hidden="true" />
              {t("beds", { count: property.beds })}
            </dd>
          </div>
          <div>
            <dt className="sr-only">{t("bathsShort")}</dt>
            <dd>
              <Bath className="size-4 text-gold-deep" aria-hidden="true" />
              {t("baths", { count: property.baths })}
            </dd>
          </div>
          <div>
            <dt className="sr-only">{t("size")}</dt>
            <dd>
              <Maximize className="size-4 text-gold-deep" aria-hidden="true" />
              {formatNumber(property.size, locale)} {t("sqft")}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
