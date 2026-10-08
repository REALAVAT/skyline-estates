import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Bath, BedDouble, Building, MapPin, Ruler } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AgentContact } from "@/components/agent/agent-contact";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { amenityIcons } from "@/components/property/amenity-icons";
import { CompareButton } from "@/components/property/compare-button";
import { FavoriteButton } from "@/components/property/favorite-button";
import { MortgageCalculator } from "@/components/property/mortgage-calculator";
import { PropertyCard } from "@/components/property/property-card";
import { toCard } from "@/lib/property-summary";
import { PropertyGallery } from "@/components/property/property-gallery";
import { PropertyLocation, type NearbyPlace } from "@/components/property/property-location";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Price } from "@/components/shared/price";
import { ShareButton } from "@/components/shared/share-button";
import { getAgent } from "@/data/agents";
import { getArea } from "@/data/areas";
import { getProject } from "@/data/projects";
import { getProperty, properties } from "@/data/properties";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { formatDate, formatNumber, formatPrice } from "@/lib/format";
import { distanceKm } from "@/lib/geo";
import { similarProperties } from "@/lib/listings";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { propertyJsonLd } from "@/lib/structured-data";
import type { Locale } from "@/types";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => properties.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/properties/[slug]">): Promise<Metadata> {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const property = getProperty(slug);
  if (!property) return {};
  const tc = await getTranslations({ locale, namespace: "common" });
  const tt = await getTranslations({ locale, namespace: "types" });
  const area = getArea(property.area);
  const price = formatPrice(property.price, "AED", locale);
  const summary = [
    tt(property.type),
    tc("beds", { count: property.beds }),
    `${formatNumber(property.size, locale)} ${tc("sqft")}`,
    area?.name[locale],
    price,
  ]
    .filter(Boolean)
    .join(" · ");
  return pageMetadata({
    locale,
    path: `/properties/${property.slug}`,
    title: property.title[locale],
    description: `${summary}. ${property.description[locale].slice(0, 110).trim()}…`,
  });
}

export default async function PropertyPage({ params }: PageProps<"/[locale]/properties/[slug]">) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  setRequestLocale(locale);
  const property = getProperty(slug);
  if (!property) notFound();

  const [t, tc, tt, ta, tPlaces, tNav, tCompletion, tForms] = await Promise.all([
    getTranslations({ locale, namespace: "property" }),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "types" }),
    getTranslations({ locale, namespace: "amenities" }),
    getTranslations({ locale, namespace: "places" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "completion" }),
    getTranslations({ locale, namespace: "forms" }),
  ]);
  const tl = await getTranslations({ locale, namespace: "listings" });

  const area = getArea(property.area);
  const agent = getAgent(property.agentId);
  const project = property.projectSlug ? getProject(property.projectSlug) : undefined;
  const similar = similarProperties(properties, property, 3);
  const title = property.title[locale];
  const isRent = property.purpose === "rent";
  const isOffPlan = property.completion === "off-plan";

  const nearby: NearbyPlace[] = (area?.places ?? [])
    .map((place, i) => ({
      id: `${area?.slug}-${i}`,
      name: place.name[locale],
      kind: place.kind,
      kindLabel: tPlaces(place.kind),
      km: distanceKm(property.coordinates, place.coordinates),
      coordinates: place.coordinates,
    }))
    .filter((place) => place.km <= 6)
    .sort((a, b) => a.km - b.km)
    .slice(0, 6)
    .map(({ km, ...rest }) => ({ ...rest, distance: t("kmAway", { distance: km < 10 ? km.toFixed(1) : Math.round(km) }) }));

  const facts: { label: string; value: string; ltr?: boolean }[] = [
    { label: t("type"), value: tt(property.type) },
    { label: t("purpose"), value: isRent ? tc("forRent") : tc("forSale") },
    { label: t("status"), value: tCompletion(property.completion) },
    { label: tc("bedsShort"), value: tc("beds", { count: property.beds }) },
    { label: tc("bathsShort"), value: tc("baths", { count: property.baths }) },
    { label: tc("size"), value: `${formatNumber(property.size, locale)} ${tc("sqft")}` },
    ...(!isRent
      ? [{ label: t("pricePerSqft"), value: formatPrice(Math.round(property.price / property.size), "AED", locale), ltr: true }]
      : []),
    { label: t("furnishing"), value: property.furnished ? t("furnished") : t("unfurnished") },
    ...(property.handover ? [{ label: t("handover"), value: property.handover }] : []),
    { label: t("building"), value: property.building[locale] },
    { label: t("reference"), value: property.ref, ltr: true },
    { label: t("listed"), value: formatDate(property.listedAt, locale) },
  ];

  const purposeHref = isOffPlan ? "/properties?purpose=off-plan" : `/properties?purpose=${property.purpose}`;

  return (
    <article className="pb-20">
      <div className="container-luxe pt-6 sm:pt-8">
        <Breadcrumbs
          locale={locale}
          items={[
            { label: tNav("properties"), href: purposeHref },
            ...(area ? [{ label: area.name[locale], href: `/areas/${area.slug}` }] : []),
            { label: title, href: `/properties/${property.slug}` },
          ]}
        />

        <div className="mt-5">
          <PropertyGallery images={property.images} title={title} />
        </div>

        <header className="mt-8 flex flex-col gap-6 border-b border-navy/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-navy px-3 py-1 text-xs font-semibold text-ivory">
                {isOffPlan ? tc("offPlanBadge") : isRent ? tc("forRent") : tc("forSale")}
              </span>
              {property.featured && (
                <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy">{tc("featured")}</span>
              )}
              <span className="rounded-full bg-sand px-3 py-1 text-xs font-medium text-ink/80">{tt(property.type)}</span>
            </div>
            <h1 className="mt-4 font-display text-3xl leading-tight font-medium text-navy sm:text-4xl lg:text-5xl rtl:leading-snug rtl:font-semibold">
              {title}
            </h1>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground sm:text-base">
              <MapPin className="size-4 shrink-0 text-gold-deep" aria-hidden="true" />
              {[property.building[locale], area?.name[locale], locale === "ar" ? "دبي" : "Dubai"].filter(Boolean).join(locale === "ar" ? "، " : ", ")}
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink">
              <li className="flex items-center gap-2">
                <BedDouble className="size-[18px] text-gold-deep" aria-hidden="true" />
                {tc("beds", { count: property.beds })}
              </li>
              <li className="flex items-center gap-2">
                <Bath className="size-[18px] text-gold-deep" aria-hidden="true" />
                {tc("baths", { count: property.baths })}
              </li>
              <li className="flex items-center gap-2">
                <Ruler className="size-[18px] text-gold-deep" aria-hidden="true" />
                {formatNumber(property.size, locale)} {tc("sqft")}
              </li>
            </ul>
          </div>
          <div className="flex shrink-0 flex-col gap-4 lg:items-end">
            <Price
              aed={property.price}
              purpose={property.purpose}
              className="font-display text-3xl font-medium text-navy sm:text-4xl"
              suffixClassName="text-base text-muted-foreground"
            />
            {isRent && <p className="-mt-2 text-xs text-muted-foreground">{t("rentNote")}</p>}
            <div className="flex flex-wrap gap-2">
              <FavoriteButton id={property.id} withLabel />
              <CompareButton id={property.id} withLabel />
              <ShareButton title={title} />
            </div>
          </div>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-14">
          <div className="min-w-0 space-y-14">
            <section aria-labelledby="facts-title">
              <h2 id="facts-title" className="font-display text-2xl text-navy sm:text-3xl">
                {t("keyFacts")}
              </h2>
              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-navy/8 ring-1 ring-navy/8 sm:grid-cols-3">
                {facts.map((fact) => (
                  <div key={fact.label} className="bg-white p-4 sm:p-5">
                    <dt className="text-xs text-muted-foreground">{fact.label}</dt>
                    <dd className="mt-1 text-sm font-semibold text-navy sm:text-base" dir={fact.ltr ? "ltr" : undefined}>
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="description-title">
              <h2 id="description-title" className="font-display text-2xl text-navy sm:text-3xl">
                {t("description")}
              </h2>
              <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink/85 sm:text-base">
                {property.description[locale].split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              {project && (
                <Link
                  href={`/off-plan/${project.slug}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-5 py-3 text-sm font-semibold text-navy transition-colors hover:bg-gold/20"
                >
                  <Building className="size-4 text-gold-deep" aria-hidden="true" />
                  {t("project")}: {project.name}
                  <ArrowRight className="size-4 rtl-flip" aria-hidden="true" />
                </Link>
              )}
            </section>

            <section aria-labelledby="amenities-title">
              <h2 id="amenities-title" className="font-display text-2xl text-navy sm:text-3xl">
                {t("amenities")}
              </h2>
              <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {property.amenities.map((key) => {
                  const Icon = amenityIcons[key];
                  return (
                    <li key={key} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 text-sm font-medium text-ink ring-1 ring-navy/5">
                      <Icon className="size-5 shrink-0 text-gold-deep" aria-hidden="true" />
                      {ta(key)}
                    </li>
                  );
                })}
              </ul>
            </section>

            <section aria-labelledby="floorplan-title">
              <h2 id="floorplan-title" className="font-display text-2xl text-navy sm:text-3xl">
                {t("floorPlan")}
              </h2>
              <div className="mt-6 overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-navy/5 sm:p-6">
                <Image
                  src={`/floorplans/${property.floorPlan}.svg`}
                  alt={t("floorPlanAlt", { title })}
                  width={800}
                  height={560}
                  unoptimized
                  className="h-auto w-full"
                />
              </div>
            </section>

            <section aria-labelledby="location-title">
              <h2 id="location-title" className="font-display text-2xl text-navy sm:text-3xl">
                {t("location")}
              </h2>
              <div className="mt-6">
                <PropertyLocation
                  center={property.coordinates}
                  places={nearby}
                  mapLabel={`${t("location")}: ${title}`}
                  homeLabel={title}
                  nearbyTitle={t("nearby")}
                />
              </div>
            </section>

            {!isRent && <MortgageCalculator defaultPrice={property.price} />}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
              {agent && <AgentContact agent={agent} locale={locale} propertyRef={property.ref} />}
              <div className="mt-6 border-t border-navy/10 pt-6">
                <h2 className="font-display text-xl text-navy">{tForms("inquiryTitle")}</h2>
                <p className="mt-1 mb-5 text-sm text-muted-foreground">{tForms("inquirySubtitle")}</p>
                <InquiryForm
                  compact
                  propertyRef={property.ref}
                  propertyTitle={property.title.en}
                  agentName={agent?.name.en}
                  defaultMessage={tForms("inquiryDefault", { title, ref: property.ref })}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {similar.length > 0 && (
        <section aria-labelledby="similar-title" className="mt-20 bg-sand/60 py-16 sm:py-20">
          <div className="container-luxe">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">{t("similarSubtitle")}</p>
                <h2 id="similar-title" className="section-title mt-3">
                  {t("similar")}
                </h2>
              </div>
              <Link href={purposeHref} className="btn-outline self-start sm:self-auto">
                {tl("title")}
                <ArrowRight className="size-4 rtl-flip" aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => (
                <li key={p.id}>
                  <PropertyCard property={toCard(p)} className="h-full" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(propertyJsonLd(property, locale))} />
    </article>
  );
}
