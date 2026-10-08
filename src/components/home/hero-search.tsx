"use client";

import { useId, useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { areaOptions } from "@/data/area-names";
import { useRouter } from "@/i18n/navigation";
import { formatPrice } from "@/lib/format";
import { propertyTypes, serializeFilters, type PurposeFilter } from "@/lib/listings";
import { useCurrency } from "@/lib/stores";
import { cn } from "@/lib/utils";
import type { AreaSlug, PropertyType } from "@/types";

type Range = { min?: number; max?: number };

const presets: Record<"sale" | "rent", Range[]> = {
  sale: [{ max: 2_000_000 }, { min: 2_000_000, max: 5_000_000 }, { min: 5_000_000, max: 10_000_000 }, { min: 10_000_000, max: 30_000_000 }, { min: 30_000_000 }],
  rent: [{ max: 100_000 }, { min: 100_000, max: 200_000 }, { min: 200_000, max: 500_000 }, { min: 500_000 }],
};

const tabs: PurposeFilter[] = ["buy", "rent", "off-plan"];

export function HeroSearch() {
  const t = useTranslations("hero");
  const tp = useTranslations("purpose");
  const tt = useTranslations("types");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const { currency } = useCurrency();
  const id = useId();

  const [purpose, setPurpose] = useState<PurposeFilter>("buy");
  const [area, setArea] = useState<AreaSlug | "">("");
  const [type, setType] = useState<PropertyType | "">("");
  const [price, setPrice] = useState("");
  const [beds, setBeds] = useState("");

  const ranges = presets[purpose === "rent" ? "rent" : "sale"];
  const money = (aed: number) => formatPrice(aed, currency, locale, { compact: true });
  const rangeLabel = (r: Range) =>
    r.min && r.max
      ? t("between", { min: money(r.min), max: money(r.max) })
      : r.max
        ? t("upTo", { price: money(r.max) })
        : t("andAbove", { price: money(r.min ?? 0) });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const range = price === "" ? undefined : ranges[Number(price)];
    const query = serializeFilters({
      purpose,
      area: area || undefined,
      type: type || undefined,
      minPrice: range?.min,
      maxPrice: range?.max,
      beds: beds || undefined,
    });
    router.push(`/properties?${query}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      aria-label={t("searchLabel")}
      className="w-full max-w-5xl rounded-[1.75rem] bg-white/95 p-2.5 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.55)] ring-1 ring-white/40 backdrop-blur-xl sm:p-3"
    >
      <div className="flex gap-1 p-1" role="group" aria-label={t("searchLabel")}>
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            aria-pressed={purpose === tab}
            onClick={() => {
              setPurpose(tab);
              setPrice("");
            }}
            className={cn(
              "h-10 flex-1 rounded-full px-4 text-sm font-semibold transition-all duration-300 sm:flex-none sm:px-6",
              purpose === tab ? "bg-navy text-ivory shadow-soft" : "text-ink/70 hover:bg-sand hover:text-navy",
            )}
          >
            {tp(tab)}
          </button>
        ))}
      </div>

      <div className="grid gap-2 p-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.2fr_0.8fr_auto]">
        <Field label={t("location")} htmlFor={`${id}-area`}>
          <select id={`${id}-area`} className="field border-0 bg-sand/70" value={area} onChange={(e) => setArea(e.target.value as AreaSlug | "")}>
            <option value="">{t("allLocations")}</option>
            {areaOptions.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name[locale]}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("propertyType")} htmlFor={`${id}-type`}>
          <select id={`${id}-type`} className="field border-0 bg-sand/70" value={type} onChange={(e) => setType(e.target.value as PropertyType | "")}>
            <option value="">{t("allTypes")}</option>
            {propertyTypes.map((pt) => (
              <option key={pt} value={pt}>
                {tt(pt)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("priceRange")} htmlFor={`${id}-price`}>
          <select id={`${id}-price`} className="field border-0 bg-sand/70" value={price} onChange={(e) => setPrice(e.target.value)}>
            <option value="">{t("anyPrice")}</option>
            {ranges.map((r, i) => (
              <option key={i} value={i}>
                {rangeLabel(r)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("bedrooms")} htmlFor={`${id}-beds`}>
          <select id={`${id}-beds`} className="field border-0 bg-sand/70" value={beds} onChange={(e) => setBeds(e.target.value)}>
            <option value="">{t("anyBeds")}</option>
            {["0", "1", "2", "3", "4", "5"].map((b) => (
              <option key={b} value={b}>
                {b === "5" ? `5+` : tc("beds", { count: Number(b) })}
              </option>
            ))}
          </select>
        </Field>
        <button type="submit" className="btn-gold h-[3.75rem] self-end rounded-2xl px-8 text-base sm:col-span-2 lg:col-span-1 lg:h-[3.75rem]">
          <Search className="size-5" aria-hidden="true" />
          {t("search")}
        </button>
      </div>
    </form>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl px-1">
      <label htmlFor={htmlFor} className="px-2 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase rtl:tracking-normal">
        {label}
      </label>
      {children}
    </div>
  );
}
