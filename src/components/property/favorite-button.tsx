"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "@/lib/toast";
import { useFavorites } from "@/lib/stores";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  id,
  className,
  withLabel = false,
}: {
  id: string;
  className?: string;
  withLabel?: boolean;
}) {
  const t = useTranslations("favorites");
  const { has, toggle } = useFavorites();
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
        const added = toggle(id);
        toast(added ? t("added") : t("removed"));
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300",
        withLabel
          ? "h-11 border border-navy/15 bg-white px-5 text-sm font-semibold text-navy hover:border-navy"
          : "size-10 bg-white/90 text-navy shadow-soft backdrop-blur hover:scale-105 hover:bg-white",
        className,
      )}
    >
      <Heart
        aria-hidden="true"
        className={cn("size-[18px] transition-all", active ? "fill-[#c0392b] text-[#c0392b]" : "")}
      />
      {withLabel && <span>{active ? t("remove") : t("add")}</span>}
    </button>
  );
}
