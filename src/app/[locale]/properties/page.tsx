import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ListingsExplorer } from "@/components/listings/listings-explorer";
import { properties } from "@/data/properties";
import { applyFilters, paginate, parseFilters, serializeFilters } from "@/lib/listings";
import { toSummary } from "@/lib/property-summary";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { itemListJsonLd } from "@/lib/structured-data";
import type { Locale } from "@/types";

export async function generateMetadata({ params, searchParams }: PageProps<"/[locale]/properties">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const filters = parseFilters(await searchParams);
  const t = await getTranslations({ locale, namespace: "meta" });
  const tl = await getTranslations({ locale, namespace: "listings" });
  const title =
    filters.purpose === "rent" ? tl("titleRent") : filters.purpose === "off-plan" ? tl("titleOffPlan") : tl("titleBuy");
  return pageMetadata({ locale, path: "/properties", title, description: t("propertiesDescription") });
}

export default async function PropertiesPage({ params, searchParams }: PageProps<"/[locale]/properties">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const filters = parseFilters(await searchParams);
  const { items } = paginate(applyFilters(properties, filters), filters.page);

  return (
    <>
      <ListingsExplorer key={serializeFilters(filters)} properties={properties.map(toSummary)} initialFilters={filters} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(itemListJsonLd(items, locale))} />
    </>
  );
}
