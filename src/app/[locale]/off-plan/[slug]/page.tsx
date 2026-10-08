import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { PaymentPlanBar } from "@/components/project/payment-plan-bar";
import { PropertyCard } from "@/components/property/property-card";
import { toCard } from "@/lib/property-summary";
import { PropertyLocation, type NearbyPlace } from "@/components/property/property-location";
import { PageHero } from "@/components/shared/page-hero";
import { Price } from "@/components/shared/price";
import { getArea } from "@/data/areas";
import { getDeveloper, getProject, projects } from "@/data/projects";
import { properties } from "@/data/properties";
import { routing } from "@/i18n/routing";
import { formatNumber, formatPrice } from "@/lib/format";
import { distanceKm } from "@/lib/geo";
import { jsonLd, localizedUrl, pageMetadata } from "@/lib/seo";
import type { Locale } from "@/types";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/off-plan/[slug]">): Promise<Metadata> {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const project = getProject(slug);
  if (!project) return {};
  return pageMetadata({
    locale,
    path: `/off-plan/${project.slug}`,
    title: `${project.name} – ${project.tagline[locale]}`,
    description: project.description[locale].slice(0, 155).trim(),
    image: project.image,
  });
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/off-plan/[slug]">) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  setRequestLocale(locale);
  const project = getProject(slug);
  if (!project) notFound();

  const [t, tNav, tPlaces, tProp, tForms, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "offPlan" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "places" }),
    getTranslations({ locale, namespace: "property" }),
    getTranslations({ locale, namespace: "forms" }),
    getTranslations({ locale, namespace: "common" }),
  ]);

  const area = getArea(project.area);
  const developer = getDeveloper(project.developerId);
  const units = properties.filter((p) => p.projectSlug === project.slug);

  const nearby: NearbyPlace[] = (area?.places ?? [])
    .map((place, i) => ({
      id: `${project.slug}-${i}`,
      name: place.name[locale],
      kind: place.kind,
      kindLabel: tPlaces(place.kind),
      km: distanceKm(project.coordinates, place.coordinates),
      coordinates: place.coordinates,
    }))
    .filter((place) => place.km <= 6)
    .sort((a, b) => a.km - b.km)
    .slice(0, 6)
    .map(({ km, ...rest }) => ({ ...rest, distance: tProp("kmAway", { distance: km < 10 ? km.toFixed(1) : Math.round(km) }) }));

  const stats = [
    { label: t("handover"), value: project.handover, ltr: true },
    { label: t("bedrooms"), value: project.bedrooms, ltr: true },
    { label: t("unitTypes"), value: project.unitTypes[locale] },
    { label: t("totalUnits"), value: formatNumber(project.totalUnits, locale) },
    { label: t("location"), value: area?.name[locale] ?? "" },
    { label: t("developer"), value: developer?.name ?? "" },
  ];

  const structured = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: project.name,
    description: project.description[locale],
    url: localizedUrl(locale, `/off-plan/${project.slug}`),
    image: project.gallery,
    address: { "@type": "PostalAddress", addressLocality: area?.name.en, addressRegion: "Dubai", addressCountry: "AE" },
    geo: { "@type": "GeoCoordinates", latitude: project.coordinates[0], longitude: project.coordinates[1] },
  };

  return (
    <>
      <PageHero
        locale={locale}
        size="lg"
        crumbs={[
          { label: tNav("offPlan"), href: "/off-plan" },
          { label: project.name, href: `/off-plan/${project.slug}` },
        ]}
        eyebrow={`${t(`status.${project.status}`)} · ${developer?.name ?? ""}`}
        title={project.name}
        subtitle={project.tagline[locale]}
        image={project.image}
      >
        <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
          <div>
            <p className="text-sm text-white/70">{t("startingFrom")}</p>
            <Price aed={project.startingPrice} className="font-display text-3xl font-medium text-gold-light sm:text-4xl" />
          </div>
          <div className="min-w-56">
            <p className="flex justify-between text-sm text-white/70">
              <span>{t("progress")}</span>
              <span dir="ltr" className="font-semibold text-white">
                {project.progress}%
              </span>
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-gold" style={{ width: `${project.progress}%` }} />
            </div>
          </div>
        </div>
      </PageHero>

      <div className="container-luxe grid gap-12 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-16">
        <div className="min-w-0 space-y-14">
          <section aria-labelledby="overview-title">
            <h2 id="overview-title" className="font-display text-2xl text-navy sm:text-3xl">
              {tProp("overview")}
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-ink/85 sm:text-base">{project.description[locale]}</p>
            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-navy/8 ring-1 ring-navy/8 sm:grid-cols-3">
              {stats.map((s) => (
                <div key={s.label} className="bg-white p-4 sm:p-5">
                  <dt className="text-xs text-muted-foreground">{s.label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-navy sm:text-base" dir={s.ltr ? "ltr" : undefined}>
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-label={tProp("gallery")}>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {project.gallery.map((src, i) => (
                <li
                  key={src}
                  className={`relative overflow-hidden rounded-xl bg-sand ${i === 0 ? "col-span-2 row-span-2 aspect-square sm:aspect-auto" : "aspect-square"}`}
                >
                  <Image
                    src={src}
                    alt={tCommon("photoAlt", { title: project.name, index: i + 1 })}
                    fill
                    sizes={i === 0 ? "(min-width: 640px) 40vw, 100vw" : "(min-width: 640px) 20vw, 50vw"}
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="plan-title" className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5 sm:p-8">
            <h2 id="plan-title" className="font-display text-2xl text-navy sm:text-3xl">
              {t("paymentPlan")}
            </h2>
            <div className="mt-6">
              <PaymentPlanBar plan={project.paymentPlan} locale={locale} />
            </div>
            <div className="mt-8 border-t border-navy/5 pt-6">
              <p className="text-sm font-semibold text-navy">
                {t("examplePlan", { price: formatPrice(project.startingPrice, "AED", locale) })}
              </p>
              <ul className="mt-4 divide-y divide-navy/5">
                {project.paymentPlan.map((step) => (
                  <li key={step.stage} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <span className="text-ink/80">
                      {step.label[locale]} <span className="text-muted-foreground" dir="ltr">({step.percent}%)</span>
                    </span>
                    <Price aed={Math.round((project.startingPrice * step.percent) / 100)} className="font-semibold text-navy" />
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section aria-labelledby="highlights-title">
            <h2 id="highlights-title" className="font-display text-2xl text-navy sm:text-3xl">
              {t("highlights")}
            </h2>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {project.highlights.map((h) => (
                <li key={h.en} className="flex items-start gap-3 rounded-xl bg-white p-4 text-sm font-medium text-ink ring-1 ring-navy/5">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold/20 text-gold-deep">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  {h[locale]}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="location-title">
            <h2 id="location-title" className="font-display text-2xl text-navy sm:text-3xl">
              {t("location")}
            </h2>
            <div className="mt-6">
              <PropertyLocation
                center={project.coordinates}
                places={nearby}
                mapLabel={`${t("location")}: ${project.name}`}
                homeLabel={project.name}
                nearbyTitle={tProp("nearby")}
              />
            </div>
          </section>

          {developer && (
            <section aria-labelledby="developer-title" className="rounded-2xl bg-sand/70 p-6 sm:p-8">
              <p className="eyebrow">{t("aboutDeveloper")}</p>
              <h2 id="developer-title" className="mt-3 font-display text-3xl text-navy">
                {developer.name}
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/80">{developer.description[locale]}</p>
              <dl className="mt-6 flex gap-10">
                <div>
                  <dt className="text-xs text-muted-foreground">{t("founded")}</dt>
                  <dd className="font-display text-3xl text-navy">{developer.founded}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{t("delivered")}</dt>
                  <dd className="font-display text-3xl text-navy">{developer.delivered}</dd>
                </div>
              </dl>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
            <h2 className="font-display text-2xl text-navy">{t("enquire")}</h2>
            <p className="mt-1 mb-5 text-sm text-muted-foreground">{tForms("inquirySubtitle")}</p>
            <InquiryForm
              compact
              propertyTitle={project.name}
              defaultMessage={tForms("inquiryDefault", { title: project.name, ref: developer?.name ?? project.handover })}
            />
          </div>
        </aside>
      </div>

      <section aria-labelledby="units-title" className="bg-sand/60 py-16 sm:py-20">
        <div className="container-luxe">
          <h2 id="units-title" className="section-title">
            {t("availableUnits")}
          </h2>
          {units.length > 0 ? (
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {units.map((p) => (
                <li key={p.id}>
                  <PropertyCard property={toCard(p)} className="h-full" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-muted-foreground">{t("noUnits")}</p>
          )}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structured)} />
    </>
  );
}
