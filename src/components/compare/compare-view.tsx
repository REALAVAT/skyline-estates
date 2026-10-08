"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { Check, GitCompareArrows, Minus, Plus, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { amenityIcons } from "@/components/property/amenity-icons";
import { Price } from "@/components/shared/price";
import { areaNames } from "@/data/area-names";
import { Link } from "@/i18n/navigation";
import { formatNumber, formatPrice } from "@/lib/format";
import { COMPARE_LIMIT, useCompare, useCurrency } from "@/lib/stores";
import type { AmenityKey, Locale, PropertySummary } from "@/types";

export function CompareView({ properties }: { properties: PropertySummary[] }) {
  const t = useTranslations("compare");
  const tc = useTranslations("common");
  const tt = useTranslations("types");
  const ta = useTranslations("amenities");
  const tp = useTranslations("property");
  const tCompletion = useTranslations("completion");
  const locale = useLocale() as Locale;
  const { currency } = useCurrency();
  const { ids, remove, clear } = useCompare();
  const list = ids.map((id) => properties.find((p) => p.id === id)).filter((p): p is PropertySummary => p !== undefined);

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-stone-line bg-white px-6 py-20 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-sand text-gold-deep">
          <GitCompareArrows className="size-7" aria-hidden="true" />
        </span>
        <h2 className="mt-6 font-display text-2xl text-navy">{t("empty")}</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t("emptyHint")}</p>
        <Link href="/properties" className="btn-navy mt-8">
          {tc("viewAll")}
        </Link>
      </div>
    );
  }

  const allAmenities = Array.from(new Set(list.flatMap((p) => p.amenities))) as AmenityKey[];
  const minPrice = Math.min(...list.map((p) => p.price));
  const maxSize = Math.max(...list.map((p) => p.size));

  const rows: { label: string; render: (p: PropertySummary) => ReactNode }[] = [
    {
      label: t("price"),
      render: (p) => (
        <span className={p.price === minPrice && list.length > 1 ? "text-emerald-700" : undefined}>
          <Price aed={p.price} purpose={p.purpose} suffixClassName="text-xs font-normal text-muted-foreground" />
        </span>
      ),
    },
    {
      label: t("pricePerSqft"),
      render: (p) => <span dir="ltr">{formatPrice(Math.round(p.price / p.size), currency, locale)}</span>,
    },
    { label: t("location"), render: (p) => areaNames[p.area]?.[locale] },
    { label: t("type"), render: (p) => tt(p.type) },
    { label: t("bedrooms"), render: (p) => tc("beds", { count: p.beds }) },
    { label: t("bathrooms"), render: (p) => tc("baths", { count: p.baths }) },
    {
      label: t("size"),
      render: (p) => (
        <span className={p.size === maxSize && list.length > 1 ? "text-emerald-700" : undefined}>
          {formatNumber(p.size, locale)} {tc("sqft")}
        </span>
      ),
    },
    { label: t("status"), render: (p) => (p.handover ? `${tCompletion(p.completion)} · ${p.handover}` : tCompletion(p.completion)) },
    { label: t("furnishing"), render: (p) => (p.furnished ? tp("furnished") : tp("unfurnished")) },
  ];

  return (
    <>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={clear}
          className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
        >
          <X className="size-4" aria-hidden="true" />
          {t("clear")}
        </button>
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-soft ring-1 ring-navy/5">
        <table className="w-full min-w-[640px] table-fixed border-collapse text-sm">
          <caption className="sr-only">{t("title")}</caption>
          <colgroup>
            <col className="w-40 sm:w-48" />
            {list.map((p) => (
              <col key={p.id} />
            ))}
            {list.length < COMPARE_LIMIT && <col />}
          </colgroup>
          <thead>
            <tr>
              <td className="p-4" />
              {list.map((p) => (
                <th key={p.id} scope="col" className="p-4 text-start align-top font-normal">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand">
                    <Image src={p.images[0]} alt="" fill sizes="(min-width: 1024px) 25vw, 40vw" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => remove(p.id)}
                      aria-label={`${t("remove")}: ${p.title[locale]}`}
                      className="absolute end-2 top-2 grid size-8 place-items-center rounded-full bg-white/95 text-navy shadow-soft hover:bg-white"
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                  <Link
                    href={`/properties/${p.slug}`}
                    className="mt-3 line-clamp-2 block font-display text-lg leading-snug font-semibold text-navy hover:text-gold-deep"
                  >
                    {p.title[locale]}
                  </Link>
                </th>
              ))}
              {list.length < COMPARE_LIMIT && (
                <td className="p-4 align-top">
                  <Link
                    href="/properties"
                    className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl px-3 text-center border-2 border-dashed border-stone-line text-sm font-medium text-muted-foreground transition-colors hover:border-gold hover:text-navy"
                  >
                    <Plus className="size-6" aria-hidden="true" />
                    {t("addMore")}
                  </Link>
                </td>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-navy/5">
                <th scope="row" className="bg-ivory/60 p-4 text-start text-xs font-semibold text-muted-foreground">
                  {row.label}
                </th>
                {list.map((p) => (
                  <td key={p.id} className="p-4 font-medium text-navy">
                    {row.render(p)}
                  </td>
                ))}
                {list.length < COMPARE_LIMIT && <td />}
              </tr>
            ))}
            <tr className="border-t border-navy/5">
              <th scope="row" className="bg-ivory/60 p-4 text-start align-top text-xs font-semibold text-muted-foreground">
                {t("amenities")}
              </th>
              {list.map((p) => (
                <td key={p.id} className="p-4 align-top">
                  <ul className="space-y-2">
                    {allAmenities.map((a) => {
                      const has = p.amenities.includes(a);
                      const Icon = amenityIcons[a];
                      return (
                        <li key={a} className={`flex items-center gap-2 text-xs ${has ? "text-ink" : "text-muted-foreground/60"}`}>
                          {has ? (
                            <Check className="size-3.5 shrink-0 text-emerald-700" aria-hidden="true" />
                          ) : (
                            <Minus className="size-3.5 shrink-0" aria-hidden="true" />
                          )}
                          <Icon className="size-3.5 shrink-0 text-gold-deep" aria-hidden="true" />
                          <span className={has ? undefined : "line-through"}>{ta(a)}</span>
                          <span className="sr-only">{has ? tc("yes") : tc("no")}</span>
                        </li>
                      );
                    })}
                  </ul>
                </td>
              ))}
              {list.length < COMPARE_LIMIT && <td />}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
