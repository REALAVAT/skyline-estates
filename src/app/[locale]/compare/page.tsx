import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CompareView } from "@/components/compare/compare-view";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { properties } from "@/data/properties";
import { toSummary } from "@/lib/property-summary";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/types";

export async function generateMetadata({ params }: PageProps<"/[locale]/compare">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "meta" });
  const tc = await getTranslations({ locale, namespace: "compare" });
  return {
    ...pageMetadata({ locale, path: "/compare", title: t("compareTitle"), description: tc("subtitle") }),
    robots: { index: false, follow: true },
  };
}

export default async function ComparePage({ params }: PageProps<"/[locale]/compare">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "compare" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return (
    <div className="container-luxe pt-8 pb-24">
      <Breadcrumbs locale={locale} items={[{ label: tNav("compare"), href: "/compare" }]} />
      <h1 className="mt-8 font-display text-4xl font-medium text-navy sm:text-5xl rtl:font-semibold">{t("title")}</h1>
      <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
      <div className="mt-8">
        <CompareView properties={properties.map(toSummary)} />
      </div>
    </div>
  );
}
