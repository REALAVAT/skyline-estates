"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Link2,
  List,
  Map as MapIcon,
  SearchX,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "@/lib/toast";
import { PropertyCard } from "@/components/property/property-card";
import { areaOptions } from "@/data/area-names";
import {
  activeFilterCount,
  applyFilters,
  bedOptions,
  defaultFilters,
  paginate,
  purposeFilters,
  serializeFilters,
  sortKeys,
  type ListingFilters,
  type SortKey,
} from "@/lib/listings";
import { useCompare, useCurrency } from "@/lib/stores";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import type { AreaSlug, PropertySummary } from "@/types";

const FiltersSheet = dynamic(() => import("./filters-sheet"), { ssr: false });

const ListingsMap = dynamic(() => import("@/components/map/listings-map"), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-sand" />,
});

const sortLabel: Record<SortKey, "sortNewest" | "sortPriceAsc" | "sortPriceDesc" | "sortSizeDesc"> = {
  newest: "sortNewest",
  "price-asc": "sortPriceAsc",
  "price-desc": "sortPriceDesc",
  "size-desc": "sortSizeDesc",
};

export function ListingsExplorer({
  properties: allProperties,
  initialFilters,
}: {
  properties: PropertySummary[];
  initialFilters: ListingFilters;
}) {
  const t = useTranslations("listings");
  const tp = useTranslations("purpose");
  const tc = useTranslations("common");
  const tHero = useTranslations("hero");
  const locale = useLocale();
  const { currency } = useCurrency();
  const { ids: compareIds } = useCompare();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [filters, setFilters] = useState<ListingFilters>(initialFilters);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetLoaded, setSheetLoaded] = useState(false);
  const filtersButton = useRef<HTMLButtonElement>(null);
  const [mobileMap, setMobileMap] = useState(false);
  const listTop = useRef<HTMLDivElement>(null);

  const results = useMemo(() => applyFilters(allProperties, filters), [allProperties, filters]);
  const { items, page, totalPages } = paginate(results, filters.page);
  const filterCount = activeFilterCount(filters);

  useEffect(() => {
    const query = serializeFilters(filters);
    const url = `${window.location.pathname}${query ? `?${query}` : ""}`;
    if (url !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(window.history.state, "", url);
    }
  }, [filters]);

  useEffect(() => {
    document.body.style.overflow = mobileMap ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMap]);

  const update = useCallback((patch: Partial<ListingFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch, page: "page" in patch ? (patch.page ?? 1) : 1 }));
  }, []);

  const reset = () =>
    setFilters({ ...defaultFilters, purpose: filters.purpose, view: filters.view, map: filters.map });

  const goToPage = (next: number) => {
    update({ page: next });
    listTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectFromMap = useCallback((id: string) => {
    setActiveId(id);
    const card = document.getElementById(`property-${id}`);
    if (card && window.matchMedia("(min-width: 1024px)").matches) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const mapProperties = results;
  const showMap = filters.map;
  const isList = filters.view === "list";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t("linkCopied"));
    } catch {
      toast(window.location.href);
    }
  };

  const title =
    filters.purpose === "rent" ? t("titleRent") : filters.purpose === "off-plan" ? t("titleOffPlan") : t("titleBuy");

  return (
    <div className="pb-24">
      {/* Toolbar */}
      <div className="sticky top-[72px] z-30 border-b border-navy/5 bg-ivory/95 backdrop-blur-xl lg:top-20">
        <div className="container-luxe flex items-center gap-2 py-3 sm:gap-3">
          <div className="flex shrink-0 rounded-full bg-sand p-1" role="group" aria-label={t("purpose")}>
            {purposeFilters.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={filters.purpose === p}
                onClick={() => update({ purpose: p, minPrice: undefined, maxPrice: undefined })}
                className={cn(
                  "h-9 rounded-full px-3 text-sm font-semibold whitespace-nowrap transition-colors sm:px-4",
                  filters.purpose === p ? "bg-navy text-ivory" : "text-ink/70 hover:text-navy",
                )}
              >
                {tp(p)}
              </button>
            ))}
          </div>

          <label className="sr-only" htmlFor="toolbar-area">
            {t("area")}
          </label>
          <select
            id="toolbar-area"
            className="field hidden h-11 w-48 md:block"
            value={filters.area ?? ""}
            onChange={(e) => update({ area: (e.target.value || undefined) as AreaSlug | undefined })}
          >
            <option value="">{tHero("allLocations")}</option>
            {areaOptions.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name[locale]}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="toolbar-beds">
            {t("beds")}
          </label>
          <select
            id="toolbar-beds"
            className="field hidden h-11 w-44 lg:block"
            value={filters.beds ?? ""}
            onChange={(e) => update({ beds: e.target.value || undefined })}
          >
            <option value="">
              {t("beds")}: {tc("any")}
            </option>
            {bedOptions.map((b) => (
              <option key={b} value={b}>
                {b === "5" ? "5+" : tc("beds", { count: Number(b) })}
              </option>
            ))}
          </select>

          <button
            ref={filtersButton}
            type="button"
            onClick={() => {
              setSheetLoaded(true);
              setSheetOpen(true);
            }}
            aria-label={filterCount ? t("filtersCount", { count: filterCount }) : t("filters")}
            className="ms-auto inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-navy/15 bg-white px-4 text-sm font-semibold text-navy transition-colors hover:border-navy md:ms-0"
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">{filterCount ? t("filtersCount", { count: filterCount }) : t("filters")}</span>
            {filterCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-gold text-[11px] font-bold text-navy sm:hidden">
                {filterCount}
              </span>
            )}
          </button>
          {filterCount > 0 && (
            <button
              type="button"
              onClick={reset}
              className="hidden h-11 items-center gap-1.5 rounded-full px-3 text-sm text-muted-foreground hover:text-navy md:inline-flex"
            >
              <X className="size-4" aria-hidden="true" />
              {t("resetFilters")}
            </button>
          )}
        </div>
      </div>

      <div className="container-luxe pt-8">
        <div ref={listTop} className="scroll-mt-40" />
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-medium text-navy sm:text-4xl rtl:font-semibold">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground" aria-live="polite">
              {t("results", { count: results.length })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="sort" className="sr-only">
              {t("sort")}
            </label>
            <select
              id="sort"
              className="field h-10 w-auto min-w-44"
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as SortKey })}
            >
              {sortKeys.map((s) => (
                <option key={s} value={s}>
                  {t(sortLabel[s])}
                </option>
              ))}
            </select>
            <div className="flex rounded-full border border-navy/10 bg-white p-0.5" role="group">
              <button
                type="button"
                aria-pressed={!isList}
                aria-label={t("grid")}
                title={t("grid")}
                onClick={() => update({ view: "grid", page: filters.page })}
                className="grid size-9 place-items-center rounded-full text-navy transition-colors aria-pressed:bg-navy aria-pressed:text-ivory"
              >
                <LayoutGrid className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-pressed={isList}
                aria-label={t("list")}
                title={t("list")}
                onClick={() => update({ view: "list", page: filters.page })}
                className="grid size-9 place-items-center rounded-full text-navy transition-colors aria-pressed:bg-navy aria-pressed:text-ivory"
              >
                <List className="size-4" aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              aria-pressed={showMap}
              onClick={() => update({ map: !showMap, page: filters.page })}
              className="hidden h-10 items-center gap-2 rounded-full border border-navy/10 bg-white px-4 text-sm font-semibold text-navy transition-colors hover:border-navy lg:inline-flex"
            >
              <MapIcon className="size-4" aria-hidden="true" />
              {showMap ? t("hideMap") : t("showMap")}
            </button>
            <button
              type="button"
              onClick={copyLink}
              aria-label={t("shareSearch")}
              className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground hover:text-navy"
            >
              <Link2 className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t("shareSearch")}</span>
            </button>
          </div>
        </div>

        <h2 className="sr-only">{t("results", { count: results.length })}</h2>
        <div className={cn("mt-8 grid grid-cols-1 gap-8", showMap && "lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]")}>
          <div>
            {items.length === 0 ? (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-stone-line bg-white px-6 py-20 text-center">
                <SearchX className="size-10 text-gold-deep" aria-hidden="true" />
                <h2 className="mt-5 font-display text-2xl text-navy">{t("noResults")}</h2>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t("noResultsHint")}</p>
                <button type="button" onClick={reset} className="btn-navy mt-8">
                  {t("resetFilters")}
                </button>
              </div>
            ) : (
              <ul
                className={cn(
                  "grid grid-cols-1 gap-6",
                  isList
                    ? "grid-cols-1"
                    : showMap
                      ? "sm:grid-cols-2"
                      : "sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
                )}
              >
                {items.map((property, i) => (
                  <li key={property.id}>
                    <PropertyCard
                      property={property}
                      layout={isList ? "list" : "grid"}
                      highlighted={activeId === property.id}
                      onHoverChange={setActiveId}
                      priority={i < 2}
                      sizes={
                        isList
                          ? "(min-width: 640px) 40vw, 100vw"
                          : showMap
                            ? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                            : "(min-width: 1536px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                      }
                      className="h-full"
                    />
                  </li>
                ))}
              </ul>
            )}

            {totalPages > 1 && (
              <nav aria-label={t("pagination")} className="mt-12 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  aria-label={t("previous")}
                  className="grid size-11 place-items-center rounded-full border border-navy/15 text-navy transition-colors hover:bg-navy hover:text-ivory disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronLeft className="size-5 rtl-flip" aria-hidden="true" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => goToPage(n)}
                    aria-current={n === page ? "page" : undefined}
                    aria-label={t("page", { page: n })}
                    className={cn(
                      "grid size-11 place-items-center rounded-full text-sm font-semibold transition-colors",
                      n === page ? "bg-navy text-ivory" : "text-navy hover:bg-sand",
                    )}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  aria-label={t("next")}
                  className="grid size-11 place-items-center rounded-full border border-navy/15 text-navy transition-colors hover:bg-navy hover:text-ivory disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronRight className="size-5 rtl-flip" aria-hidden="true" />
                </button>
              </nav>
            )}
          </div>

          {showMap && isDesktop && (
            <div className="hidden lg:block">
              <div className="sticky top-40 h-[calc(100vh-11rem)] overflow-hidden rounded-2xl shadow-soft ring-1 ring-navy/5">
                <ListingsMap
                  properties={mapProperties}
                  currency={currency}
                  activeId={activeId}
                  onSelect={selectFromMap}
                  className="size-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile map toggle */}
      <button
        type="button"
        onClick={() => setMobileMap(true)}
        className={cn(
          "fixed left-1/2 z-30 inline-flex h-12 -translate-x-1/2 items-center gap-2 rounded-full bg-navy px-6 text-sm font-semibold text-ivory shadow-lift transition-[bottom] lg:hidden",
          compareIds.length ? "bottom-24" : "bottom-5",
        )}
      >
        <MapIcon className="size-4" aria-hidden="true" />
        {t("mapView")}
      </button>

      {mobileMap && (
        <div className="fixed inset-0 z-50 bg-ivory lg:hidden" role="dialog" aria-modal="true" aria-label={t("mapLabel")}>
          <ListingsMap
            properties={mapProperties}
            currency={currency}
            activeId={activeId}
            onSelect={setActiveId}
            className="size-full"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[1000] flex items-center justify-between p-4">
            <p className="pointer-events-auto rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-navy shadow-soft">
              {t("results", { count: results.length })}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMobileMap(false)}
            className="absolute bottom-6 left-1/2 z-[1000] inline-flex h-12 -translate-x-1/2 items-center gap-2 rounded-full bg-navy px-6 text-sm font-semibold text-ivory shadow-lift"
          >
            <List className="size-4" aria-hidden="true" />
            {t("listView")}
          </button>
        </div>
      )}

      {sheetLoaded && (
        <FiltersSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          filters={filters}
          currency={currency}
          resultCount={results.length}
          onChange={update}
          onReset={reset}
          returnFocus={filtersButton}
        />
      )}
    </div>
  );
}
