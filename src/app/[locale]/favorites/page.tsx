import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FavoritesView } from "@/components/favorites/favorites-view";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { properties } from "@/data/properties";
import { toSummary } from "@/lib/property-summary";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/types";

export async function generateMetadata({ params }: PageProps<"/[locale]/favorites">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "meta" });
  const tf = await getTranslations({ locale, namespace: "favorites" });
  return {
    ...pageMetadata({ locale, path: "/favorites", title: t("favoritesTitle"), description: tf("subtitle") }),
    robots: { index: false, follow: true },
  };
}

export default async function FavoritesPage({ params }: PageProps<"/[locale]/favorites">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "favorites" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return (
    <div className="container-luxe pt-8 pb-24">
      <Breadcrumbs locale={locale} items={[{ label: tNav("favorites"), href: "/favorites" }]} />
      <h1 className="mt-8 font-display text-4xl font-medium text-navy sm:text-5xl rtl:font-semibold">{t("title")}</h1>
      <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
      <div className="mt-8">
        <FavoritesView properties={properties.map(toSummary)} />
      </div>
    </div>
  );
}
