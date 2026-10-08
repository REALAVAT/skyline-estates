"use client";

import { useLocale, useTranslations } from "next-intl";
import { formatPrice } from "@/lib/format";
import { useCurrency } from "@/lib/stores";
import type { Purpose } from "@/types";

interface PriceProps {
  aed: number;
  purpose?: Purpose;
  compact?: boolean;
  className?: string;
  suffixClassName?: string;
}

export function Price({ aed, purpose, compact, className, suffixClassName }: PriceProps) {
  const locale = useLocale();
  const t = useTranslations("common");
  const { currency } = useCurrency();
  return (
    <span className={className}>
      <span dir="ltr" className="inline-block">
        {formatPrice(aed, currency, locale, { compact })}
      </span>
      {purpose === "rent" && <span className={suffixClassName ?? "ms-1 text-[0.7em] font-normal opacity-70"}>{t("perYear")}</span>}
    </span>
  );
}
