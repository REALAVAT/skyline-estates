import { AED_PER_USD } from "@/data/site";
import type { Locale } from "@/types";

export type Currency = "AED" | "USD";
export const currencies: Currency[] = ["AED", "USD"];

const intlLocale = (locale: Locale) => (locale === "ar" ? "ar-AE-u-nu-latn" : "en-US");

export function convert(aed: number, currency: Currency) {
  return currency === "USD" ? aed / AED_PER_USD : aed;
}

export function formatPrice(
  aed: number,
  currency: Currency,
  locale: Locale,
  options: { compact?: boolean } = {},
) {
  const value = convert(aed, currency);
  const formatter = new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency,
    currencyDisplay: currency === "AED" ? (locale === "ar" ? "symbol" : "code") : "narrowSymbol",
    notation: options.compact ? "compact" : "standard",
    maximumFractionDigits: options.compact ? 2 : 0,
  });
  return formatter.format(value).replace(/\u00a0/g, " ");
}

/** Short price for map pins, e.g. "3.65M" / "850K". */
export function formatPriceShort(aed: number, currency: Currency) {
  const value = convert(aed, currency);
  const prefix = currency === "USD" ? "$" : "";
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `${prefix}${m >= 10 ? m.toFixed(1).replace(/\.0$/, "") : m.toFixed(2).replace(/\.?0+$/, "")}M`;
  }
  return `${prefix}${Math.round(value / 1000)}K`;
}

export function formatNumber(value: number, locale: Locale, maximumFractionDigits = 0) {
  return new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits }).format(value);
}

export function formatDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-AE-u-nu-latn" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
