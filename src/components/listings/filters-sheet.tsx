"use client";

import type { RefObject } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { Currency } from "@/lib/format";
import type { ListingFilters } from "@/lib/listings";
import { FiltersPanel } from "./filters-panel";

interface FiltersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ListingFilters;
  currency: Currency;
  resultCount: number;
  onChange: (patch: Partial<ListingFilters>) => void;
  onReset: () => void;
  returnFocus: RefObject<HTMLButtonElement | null>;
}

export default function FiltersSheet({
  open,
  onOpenChange,
  filters,
  currency,
  resultCount,
  onChange,
  onReset,
  returnFocus,
}: FiltersSheetProps) {
  const t = useTranslations("listings");
  const tc = useTranslations("common");
  const locale = useLocale();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        finalFocus={returnFocus}
        closeLabel={tc("close")}
        side={locale === "ar" ? "left" : "right"}
        className="w-full gap-0 bg-ivory p-0 sm:max-w-md data-[side=left]:sm:max-w-md data-[side=right]:sm:max-w-md"
      >
        <div className="flex h-16 shrink-0 items-center border-b border-navy/5 px-6">
          <SheetTitle className="font-display text-2xl text-navy">{t("filters")}</SheetTitle>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <FiltersPanel filters={filters} currency={currency} onChange={onChange} />
        </div>
        <div className="flex shrink-0 gap-3 border-t border-navy/5 p-4">
          <button type="button" onClick={onReset} className="btn-outline h-12 flex-1">
            {tc("reset")}
          </button>
          <button type="button" onClick={() => onOpenChange(false)} className="btn-navy h-12 flex-[2]">
            {t("showResults", { count: resultCount })}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
