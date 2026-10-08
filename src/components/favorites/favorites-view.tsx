"use client";

import { Heart, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { PropertyCard } from "@/components/property/property-card";
import { Link } from "@/i18n/navigation";
import { useFavorites } from "@/lib/stores";
import type { PropertySummary } from "@/types";

export function FavoritesView({ properties }: { properties: PropertySummary[] }) {
  const t = useTranslations("favorites");
  const { ids, clear } = useFavorites();
  const saved = ids.map((id) => properties.find((p) => p.id === id)).filter((p) => p !== undefined);

  if (saved.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-stone-line bg-white px-6 py-20 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-sand text-gold-deep">
          <Heart className="size-7" aria-hidden="true" />
        </span>
        <h2 className="mt-6 font-display text-2xl text-navy">{t("empty")}</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t("emptyHint")}</p>
        <Link href="/properties" className="btn-navy mt-8">
          {t("browse")}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={clear}
          className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          {t("clear")}
        </button>
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {saved.map((p) => (
          <li key={p.id}>
            <PropertyCard property={p} className="h-full" />
          </li>
        ))}
      </ul>
    </>
  );
}
