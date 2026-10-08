"use client";

import { useId } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { areaOptions } from "@/data/area-names";
import { formatPrice, type Currency } from "@/lib/format";
import {
  amenityKeys,
  bathOptions,
  bedOptions,
  priceScale,
  propertyTypes,
  purposeFilters,
  type ListingFilters,
} from "@/lib/listings";
import { cn } from "@/lib/utils";
import type { AreaSlug, PropertyType } from "@/types";

interface FiltersPanelProps {
  filters: ListingFilters;
  currency: Currency;
  onChange: (patch: Partial<ListingFilters>) => void;
  showQuick?: boolean;
}

function nearestIndex(steps: number[], value: number | undefined, fallback: number) {
  if (value === undefined) return fallback;
  let best = 0;
  steps.forEach((s, i) => {
    if (Math.abs(s - value) < Math.abs(steps[best] - value)) best = i;
  });
  return best;
}

export function FiltersPanel({ filters, currency, onChange, showQuick = true }: FiltersPanelProps) {
  const t = useTranslations("listings");
  const tp = useTranslations("purpose");
  const tt = useTranslations("types");
  const ta = useTranslations("amenities");
  const tc = useTranslations("common");
  const tHero = useTranslations("hero");
  const locale = useLocale();
  const id = useId();

  const steps = priceScale(filters.purpose);
  const last = steps.length - 1;
  const minIdx = nearestIndex(steps, filters.minPrice, 0);
  const maxIdx = nearestIndex(steps, filters.maxPrice, last);
  const money = (v: number) => formatPrice(v, currency, locale, { compact: true });

  return (
    <div className="space-y-8">
      {showQuick && (
        <>
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-navy">{t("purpose")}</legend>
            <div className="grid grid-cols-3 gap-1 rounded-full bg-sand p-1">
              {purposeFilters.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={filters.purpose === p}
                  onClick={() => onChange({ purpose: p, minPrice: undefined, maxPrice: undefined })}
                  className={cn(
                    "h-9 rounded-full text-sm font-semibold transition-colors",
                    filters.purpose === p ? "bg-navy text-ivory" : "text-ink/70 hover:text-navy",
                  )}
                >
                  {tp(p)}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-area`} className="mb-2 block text-sm font-semibold text-navy">
                {t("area")}
              </label>
              <select
                id={`${id}-area`}
                className="field"
                value={filters.area ?? ""}
                onChange={(e) => onChange({ area: (e.target.value || undefined) as AreaSlug | undefined })}
              >
                <option value="">{tHero("allLocations")}</option>
                {areaOptions.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.name[locale]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-type`} className="mb-2 block text-sm font-semibold text-navy">
                {t("type")}
              </label>
              <select
                id={`${id}-type`}
                className="field"
                value={filters.type ?? ""}
                onChange={(e) => onChange({ type: (e.target.value || undefined) as PropertyType | undefined })}
              >
                <option value="">{tHero("allTypes")}</option>
                {propertyTypes.map((pt) => (
                  <option key={pt} value={pt}>
                    {tt(pt)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      <fieldset>
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <legend className="text-sm font-semibold text-navy">{t("price")}</legend>
          <p className="text-sm text-muted-foreground" dir="ltr">
            {minIdx === 0 && maxIdx === last
              ? t("priceAny")
              : `${money(steps[minIdx])} – ${maxIdx === last ? t("noMax") : money(steps[maxIdx])}`}
          </p>
        </div>
        <Slider
          min={0}
          max={last}
          step={1}
          value={[minIdx, maxIdx]}
          minStepsBetweenValues={1}
          thumbLabels={[`${t("price")} – ${t("minSize")}`, `${t("price")} – ${t("maxSize")}`]}
          getAriaValueText={(_, value) => (value === last ? t("noMax") : money(steps[value]))}
          onValueChange={(value) => {
            const [a, b] = Array.isArray(value) ? value : [value, last];
            onChange({
              minPrice: a === 0 ? undefined : steps[a],
              maxPrice: b === last ? undefined : steps[b],
            });
          }}
          className="px-1 [&_[data-slot=slider-range]]:bg-navy [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-navy [&_[data-slot=slider-track]]:h-1.5"
        />
        <div className="mt-3 flex justify-between text-xs text-muted-foreground" dir="ltr">
          <span>{money(steps[0])}</span>
          <span>{t("plus", { value: money(steps[last]) })}</span>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-navy">{t("beds")}</legend>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="chip" aria-pressed={filters.beds === undefined} onClick={() => onChange({ beds: undefined })}>
            {tc("any")}
          </button>
          {bedOptions.map((b) => (
            <button key={b} type="button" className="chip" aria-pressed={filters.beds === b} onClick={() => onChange({ beds: b })}>
              {b === "0" ? tc("studio") : b === "5" ? "5+" : b}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-navy">{t("baths")}</legend>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="chip" aria-pressed={!filters.baths} onClick={() => onChange({ baths: undefined })}>
            {tc("any")}
          </button>
          {bathOptions.map((b) => (
            <button key={b} type="button" className="chip" aria-pressed={filters.baths === b} onClick={() => onChange({ baths: b })}>
              {b}+
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-navy">{t("size")}</legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${id}-min-size`} className="mb-1.5 block text-xs text-muted-foreground">
              {t("minSize")}
            </label>
            <input
              id={`${id}-min-size`}
              type="number"
              inputMode="numeric"
              min={0}
              step={100}
              placeholder="0"
              className="field"
              value={filters.minSize ?? ""}
              onChange={(e) => onChange({ minSize: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
          <div>
            <label htmlFor={`${id}-max-size`} className="mb-1.5 block text-xs text-muted-foreground">
              {t("maxSize")}
            </label>
            <input
              id={`${id}-max-size`}
              type="number"
              inputMode="numeric"
              min={0}
              step={100}
              placeholder="10,000+"
              className="field"
              value={filters.maxSize ?? ""}
              onChange={(e) => onChange({ maxSize: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-navy">{t("amenities")}</legend>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {amenityKeys.map((key) => {
            const checked = filters.amenities.includes(key);
            return (
              <label key={key} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(value) =>
                    onChange({
                      amenities: value ? [...filters.amenities, key] : filters.amenities.filter((a) => a !== key),
                    })
                  }
                  className="size-[18px] rounded-[5px] border-stone-line data-checked:border-navy data-checked:bg-navy"
                />
                {ta(key)}
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
