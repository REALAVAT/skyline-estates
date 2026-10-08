"use client";

import { useId, useMemo, useState, type CSSProperties } from "react";
import { Calculator } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatNumber, formatPrice } from "@/lib/format";
import { calculateMortgage } from "@/lib/mortgage";
import { useCurrency } from "@/lib/stores";
import type { Locale } from "@/types";

const MIN_PRICE = 300_000;

export function MortgageCalculator({ defaultPrice }: { defaultPrice: number }) {
  const t = useTranslations("mortgage");
  const locale = useLocale() as Locale;
  const { currency } = useCurrency();
  const priceId = useId();

  const [priceInput, setPriceInput] = useState(String(defaultPrice));
  const [down, setDown] = useState(25);
  const [rate, setRate] = useState(4.25);
  const [years, setYears] = useState(25);

  const price = Math.max(Number(priceInput.replace(/[^\d]/g, "")) || 0, 0);
  const result = useMemo(
    () => calculateMortgage({ price, downPaymentPercent: down, annualRatePercent: rate, years }),
    [price, down, rate, years],
  );

  const loanShare = price > 0 ? result.loanAmount / result.totalCost : 0;
  const interestShare = price > 0 ? result.totalInterest / result.totalCost : 0;
  const money = (aed: number) => formatPrice(aed, currency, locale);

  return (
    <section aria-labelledby="mortgage-title" className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5 sm:p-8">
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sand text-gold-deep">
          <Calculator className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 id="mortgage-title" className="font-display text-2xl text-navy sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div className="space-y-7">
          <div>
            <label htmlFor={priceId} className="text-sm font-semibold text-navy">
              {t("price")} (AED)
            </label>
            <input
              id={priceId}
              inputMode="numeric"
              className="field mt-2"
              dir="ltr"
              value={price ? formatNumber(price, "en") : ""}
              onChange={(e) => setPriceInput(e.target.value)}
              onBlur={() => setPriceInput(String(Math.max(price, MIN_PRICE)))}
            />
            {currency === "USD" && (
              <p className="mt-1.5 text-xs text-muted-foreground" dir="ltr">
                ≈ {formatPrice(price, "USD", locale)}
              </p>
            )}
          </div>

          <RangeField
            label={t("downPayment")}
            display={`${down}% · ${money(result.downPayment)}`}
            value={down}
            min={20}
            max={80}
            step={5}
            onChange={setDown}
            valueText={(v) => `${v}%`}
          />
          <RangeField
            label={t("interestRate")}
            display={`${rate.toFixed(2)}%`}
            value={rate}
            min={2.5}
            max={8}
            step={0.05}
            onChange={setRate}
            valueText={(v) => `${v.toFixed(2)}%`}
          />
          <RangeField
            label={t("loanTerm")}
            display={t("years", { count: years })}
            value={years}
            min={5}
            max={25}
            step={1}
            onChange={setYears}
            valueText={(v) => t("years", { count: v })}
          />
        </div>

        <div className="flex flex-col rounded-2xl bg-navy p-6 text-ivory sm:p-7">
          <p className="text-sm text-ivory/70">{t("monthly")}</p>
          <p className="mt-2 font-display text-4xl font-medium text-gold-light sm:text-5xl" dir="ltr" aria-live="polite">
            {money(result.monthlyPayment)}
          </p>

          <div className="mt-6 flex h-2 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
            <span className="bg-gold" style={{ width: `${(1 - loanShare - interestShare) * 100}%` }} />
            <span className="bg-ivory/80" style={{ width: `${loanShare * 100}%` }} />
            <span className="bg-navy-700" style={{ width: `${interestShare * 100}%` }} />
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <Row label={t("downPayment")} value={money(result.downPayment)} swatch="bg-gold" />
            <Row label={t("loanAmount")} value={money(result.loanAmount)} swatch="bg-ivory/80" />
            <Row label={t("totalInterest")} value={money(result.totalInterest)} swatch="bg-navy-700 ring-1 ring-white/30" />
            <Row label={t("totalCost")} value={money(result.totalCost)} strong className="border-t border-white/10 pt-3" />
          </dl>
          <Link href="/contact?subject=buying" className="btn-gold mt-7 w-full">
            {t("getPreApproved")}
          </Link>
          <p className="mt-4 text-[11px] leading-relaxed text-ivory/60">{t("disclaimer")}</p>
        </div>
      </div>
    </section>
  );
}

function RangeField({
  label,
  display,
  value,
  min,
  max,
  step,
  onChange,
  valueText,
}: {
  label: string;
  display: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  valueText: (value: number) => string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-navy">
          {label}
        </span>
        <span className="text-sm font-medium text-ink/80" dir="ltr">
          {display}
        </span>
      </div>
      <input
        type="range"
        className="range-luxe mt-3"
        value={value}
        min={min}
        max={max}
        step={step}
        aria-label={label}
        aria-valuetext={valueText(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--fill": `${((value - min) / (max - min)) * 100}%` } as CSSProperties}
      />
    </div>
  );
}

function Row({
  label,
  value,
  swatch,
  strong,
  className,
}: {
  label: string;
  value: string;
  swatch?: string;
  strong?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className ?? ""}`}>
      <dt className="flex items-center gap-2 text-ivory/75">
        {swatch && <span className={`size-2.5 rounded-full ${swatch}`} aria-hidden="true" />}
        {label}
      </dt>
      <dd className={strong ? "font-semibold text-ivory" : "font-medium text-ivory"} dir="ltr">
        {value}
      </dd>
    </div>
  );
}
