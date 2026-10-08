"use client";

import { GitCompareArrows } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "@/lib/toast";
import { useCompare } from "@/lib/stores";
import { cn } from "@/lib/utils";

export function CompareButton({
  id,
  className,
  withLabel = false,
}: {
  id: string;
  className?: string;
  withLabel?: boolean;
}) {
  const t = useTranslations("compare");
  const { has, toggle } = useCompare();
  const active = has(id);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? t("remove") : t("add")}
      title={active ? t("remove") : t("add")}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const result = toggle(id);
        if (result === "limit") toast.error(t("limit"));
        else toast(result === "added" ? t("added") : t("removed"));
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300",
        withLabel
          ? "h-11 border border-navy/15 bg-white px-5 text-sm font-semibold text-navy hover:border-navy aria-pressed:border-navy aria-pressed:bg-navy aria-pressed:text-ivory"
          : "size-10 bg-white/90 text-navy shadow-soft backdrop-blur hover:scale-105 hover:bg-white aria-pressed:bg-navy aria-pressed:text-gold-light",
        className,
      )}
    >
      <GitCompareArrows aria-hidden="true" className="size-[18px]" />
      {withLabel && <span>{active ? t("remove") : t("add")}</span>}
    </button>
  );
}
