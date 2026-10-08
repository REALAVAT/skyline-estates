import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Check,
  GraduationCap,
  ShoppingBag,
  Sun,
  TrainFront,
  Trees,
  TrendingUp,
  UtensilsCrossed,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectCard } from "@/components/project/project-card";
import { PropertyCard } from "@/components/property/property-card";
import { toCard } from "@/lib/property-summary";
import { PropertyLocation, type NearbyPlace } from "@/components/property/property-location";
import { PageHero } from "@/components/shared/page-hero";
import { Price } from "@/components/shared/price";
import { Reveal } from "@/components/shared/reveal";
import { areas, getArea } from "@/data/areas";
import { projects } from "@/data/projects";
import { properties } from "@/data/properties";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";
import { jsonLd, localizedUrl, pageMetadata } from "@/lib/seo";
import type { LifestyleIcon, Locale } from "@/types";

const lifestyleIcons: Record<LifestyleIcon, LucideIcon> = {
  waves: Waves,
  utensils: UtensilsCrossed,
  shopping: ShoppingBag,
  school: GraduationCap,
  train: TrainFront,
  trees: Trees,
  building: Building2,
  sun: Sun,
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => areas.map((a) => ({ locale, slug: a.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/areas/[slug]">): Promise<Metadata> {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const area = getArea(slug);
  if (!area) return {};
  const t = await getTranslations({ locale, namespace: "areas" });
  return pageMetadata({
    locale,
    path: `/areas/${area.slug}`,
    title: `${area.name[locale]} – ${t("title")}`,
    description: area.intro[locale],
    image: area.image,
  });
}

export default async function AreaPage({ params }: PageProps<"/[locale]/areas/[slug]">) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  setRequestLocale(locale);
  const area = getArea(slug);
  if (!area) notFound();

  const [t, tNav, tPlaces] = await Promise.all([
    getTranslations({ locale, namespace: "areas" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "places" }),
  ]);

  const name = area.name[locale];
  const listings = properties.filter((p) => p.area === area.slug);
  const areaProjects = projects.filter((p) => p.area === area.slug);
  const others = areas.filter((a) => a.slug !== area.slug);

  const places: NearbyPlace[] = area.places.map((place, i) => ({
    id: `${area.slug}-${i}`,
    name: place.name[locale],
    kind: place.kind,
    kindLabel: tPlaces(place.kind),
    distance: "",
    coordinates: place.coordinates,
  }));

  const snapshot = [
    { label: t("avgSale"), aed: area.avgSalePricePerSqft },
    { label: t("avgApartment"), aed: area.avgApartmentPrice },
    ...(area.avgVillaPrice ? [{ label: t("avgVilla"), aed: area.avgVillaPrice }] : []),
    { label: t("avgRent1"), aed: area.avgRent1Bed, rent: true },
    { label: t("avgRent2"), aed: area.avgRent2Bed, rent: true },
  ];

  const structured = {
    "@context": "https://schema.org",
    "@type": "Place",
    name,
    description: area.description[locale],
    url: localizedUrl(locale, `/areas/${area.slug}`),
    image: area.image,
    geo: { "@type": "GeoCoordinates", latitude: area.center[0], longitude: area.center[1] },
    containedInPlace: { "@type": "City", name: "Dubai" },
  };

  return (
    <>
      <PageHero
        locale={locale}
        size="lg"
        crumbs={[
          { label: tNav("areas"), href: "/areas" },
          { label: name, href: `/areas/${area.slug}` },
        ]}
        eyebrow={t("title")}
        title={name}
        subtitle={area.tagline[locale]}
        image={area.image}
      />

      <section className="container-luxe grid gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <p className="font-display text-2xl leading-snug text-navy sm:text-3xl rtl:leading-normal">{area.intro[locale]}</p>
          <p className="mt-6 text-[15px] leading-relaxed text-ink/80 sm:text-base">{area.description[locale]}</p>
          <ul className="mt-8 space-y-3">
            {area.highlights.map((h) => (
              <li key={h.en} className="flex items-start gap-3 text-[15px] font-medium text-ink">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold/20 text-gold-deep">
                  <Check className="size-3.5" aria-hidden="true" />
                </span>
                {h[locale]}
              </li>
            ))}
          </ul>
        </div>
        <aside aria-labelledby="snapshot-title" className="rounded-2xl bg-navy p-6 text-ivory sm:p-8 lg:self-start">
          <h2 id="snapshot-title" className="font-display text-2xl text-white">
            {t("marketSnapshot")}
          </h2>
          <dl className="mt-6 divide-y divide-white/10">
            {snapshot.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 py-3.5 text-sm">
                <dt className="text-ivory/70">{row.label}</dt>
                <dd className="font-semibold text-white">
                  <Price aed={row.aed} purpose={row.rent ? "rent" : undefined} suffixClassName="text-xs font-normal text-ivory/60" />
                </dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 py-3.5 text-sm">
              <dt className="text-ivory/70">{t("yield")}</dt>
              <dd className="font-semibold text-gold-light" dir="ltr">
                {formatNumber(area.rentalYield, locale, 1)}%
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3.5 text-sm">
              <dt className="text-ivory/70">{t("priceChange")}</dt>
              <dd className="flex items-center gap-1 font-semibold text-emerald-300" dir="ltr">
                <TrendingUp className="size-4" aria-hidden="true" />+{formatNumber(area.priceChange, locale, 1)}%
              </dd>
            </div>
          </dl>
          <p className="mt-5 text-[11px] text-ivory/50">{t("dataNote")}</p>
        </aside>
      </section>

      <section aria-labelledby="lifestyle-title" className="bg-sand/60 py-16 sm:py-20">
        <div className="container-luxe">
          <p className="eyebrow">{name}</p>
          <h2 id="lifestyle-title" className="section-title mt-3">
            {t("lifestyle")}
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {area.lifestyle.map((item, i) => {
              const Icon = lifestyleIcons[item.icon];
              return (
                <Reveal as="li" key={item.title.en} delay={i * 0.06} className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
                  <span className="grid size-12 place-items-center rounded-full bg-sand text-gold-deep">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-xl text-navy">{item.title[locale]}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text[locale]}</p>
                </Reveal>
              );
            })}
          </ul>
          <ul className="mt-10 grid grid-cols-3 gap-3">
            {area.gallery.map((src, i) => (
              <li key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand">
                <Image src={src} alt={`${name} ${i + 1}`} fill sizes="33vw" className="object-cover" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="landmarks-title" className="container-luxe py-16 sm:py-20">
        <h2 id="landmarks-title" className="section-title">
          {t("landmarks")}
        </h2>
        <div className="mt-8">
          <PropertyLocation
            center={area.center}
            places={places}
            mapLabel={`${t("landmarks")}: ${name}`}
            homeLabel={name}
            nearbyTitle={t("landmarks")}
          />
        </div>
      </section>

      {listings.length > 0 && (
        <section aria-labelledby="listings-title" className="container-luxe pb-16 sm:pb-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="listings-title" className="section-title">
              {t("listingsIn", { area: name })}
            </h2>
            <Link href={`/properties?purpose=buy&area=${area.slug}`} className="btn-outline self-start sm:self-auto">
              {t("viewListings", { area: name })}
              <ArrowRight className="size-4 rtl-flip" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.slice(0, 6).map((p) => (
              <li key={p.id}>
                <PropertyCard property={toCard(p)} className="h-full" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {areaProjects.length > 0 && (
        <section aria-labelledby="projects-title" className="container-luxe pb-16 sm:pb-20">
          <h2 id="projects-title" className="section-title">
            {t("projectsIn", { area: name })}
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areaProjects.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} locale={locale} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="others-title" className="bg-navy py-16 sm:py-20">
        <div className="container-luxe">
          <h2 id="others-title" className="section-title text-white">
            {t("otherAreas")}
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((a) => (
              <li key={a.slug}>
                <Link href={`/areas/${a.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-navy-800">
                  <Image
                    src={a.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover opacity-80 transform-gpu transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-navy/85 to-transparent" />
                  <span className="absolute inset-x-5 bottom-5 font-display text-2xl text-white">{a.name[locale]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structured)} />
    </>
  );
}
