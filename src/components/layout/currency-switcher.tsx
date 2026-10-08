"use client";

import { useTranslations } from "next-intl";
import { currencies } from "@/lib/format";
import { useCurrency } from "@/lib/stores";
import { cn } from "@/lib/utils";

export function CurrencySwitcher({ light = false, className }: { light?: boolean; className?: string }) {
  const { currency, setCurrency } = useCurrency();
  const t = useTranslations("common");

  return (
    <div
      role="group"
      aria-label={t("currency")}
      className={cn(
        "inline-flex h-9 items-center rounded-full border p-0.5 text-xs font-semibold",
        light ? "border-white/30" : "border-navy/15",
        className,
      )}
    >
      {currencies.map((c) => (
        <button
          key={c}
          type="button"
          aria-pressed={currency === c}
          onClick={() => setCurrency(c)}
          className={cn(
            "h-full rounded-full px-3 font-[family-name:var(--font-inter)] transition-colors",
            currency === c
              ? light
                ? "bg-white text-navy"
                : "bg-navy text-ivory"
              : light
                ? "text-white/85 hover:text-white"
                : "text-navy/70 hover:text-navy",
          )}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
