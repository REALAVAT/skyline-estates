import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Languages, MapPin } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { AgentContact } from "@/components/agent/agent-contact";
import { PropertyCard } from "@/components/property/property-card";
import { toCard } from "@/lib/property-summary";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { agents, getAgent } from "@/data/agents";
import { getArea } from "@/data/areas";
import { properties } from "@/data/properties";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { agentJsonLd } from "@/lib/structured-data";
import type { Locale } from "@/types";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => agents.map((a) => ({ locale, slug: a.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/agents/[slug]">): Promise<Metadata> {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const agent = getAgent(slug);
  if (!agent) return {};
  return pageMetadata({
    locale,
    path: `/agents/${agent.slug}`,
    title: `${agent.name[locale]} – ${agent.role[locale]}`,
    description: agent.bio[locale].slice(0, 155).trim(),
    image: agent.photo,
  });
}

export default async function AgentPage({ params }: PageProps<"/[locale]/agents/[slug]">) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  setRequestLocale(locale);
  const agent = getAgent(slug);
  if (!agent) notFound();

  const [t, tNav, tLang, tPage, tForms] = await Promise.all([
    getTranslations({ locale, namespace: "agent" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "languagesList" }),
    getTranslations({ locale, namespace: "agentsPage" }),
    getTranslations({ locale, namespace: "forms" }),
  ]);

  const name = agent.name[locale];
  const listings = properties.filter((p) => p.agentId === agent.id);

  const stats = [
    { label: t("experienceLabel"), value: t("yearsShort", { count: agent.experience }) },
    { label: t("deals"), value: formatNumber(agent.deals, locale) },
    { label: t("rating"), value: agent.rating.toFixed(1) },
    { label: t("listings"), value: String(listings.length) },
  ];

  return (
    <>
      <section className="bg-sand/60">
        <div className="container-luxe py-8 sm:py-10">
          <Breadcrumbs
            locale={locale}
            items={[
              { label: tNav("agents"), href: "/agents" },
              { label: name, href: `/agents/${agent.slug}` },
            ]}
          />
          <div className="mt-8 grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-center lg:gap-16">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl bg-sand shadow-lift">
              <Image src={agent.photo} alt={name} fill priority sizes="(min-width: 1024px) 360px, 90vw" className="object-cover object-top" />
            </div>
            <div>
              <p className="eyebrow">{agent.role[locale]}</p>
              <h1 className="mt-4 font-display text-4xl font-medium text-navy sm:text-5xl rtl:font-semibold">{name}</h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink/80 sm:text-base">{agent.bio[locale]}</p>
              <dl className="mt-8 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-xl bg-white p-4 ring-1 ring-navy/5">
                    <dt className="text-xs text-muted-foreground">{s.label}</dt>
                    <dd className="mt-1 font-display text-2xl font-semibold text-navy" dir="ltr">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-col gap-4 text-sm sm:flex-row sm:gap-10">
                <div>
                  <p className="flex items-center gap-2 font-semibold text-navy">
                    <Languages className="size-4 text-gold-deep" aria-hidden="true" />
                    {t("languages")}
                  </p>
                  <p className="mt-1 text-muted-foreground">{agent.languages.map((l) => tLang(l)).join(" · ")}</p>
                </div>
                <div>
                  <p className="flex items-center gap-2 font-semibold text-navy">
                    <MapPin className="size-4 text-gold-deep" aria-hidden="true" />
                    {t("specialties")}
                  </p>
                  <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                    {agent.specialties.map((slugArea) => {
                      const area = getArea(slugArea);
                      return area ? (
                        <Link key={slugArea} href={`/areas/${slugArea}`} className="text-muted-foreground underline decoration-gold/50 underline-offset-4 transition-colors hover:text-navy hover:decoration-gold">
                          {area.name[locale]}
                        </Link>
                      ) : null;
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-luxe grid gap-10 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-14">
        <div className="min-w-0">
          <h2 className="section-title">{t("listings")}</h2>
          {listings.length > 0 ? (
            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {listings.map((p) => (
                <li key={p.id}>
                  <PropertyCard property={toCard(p)} className="h-full" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-muted-foreground">{tPage("noListings")}</p>
          )}
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
            <AgentContact agent={agent} locale={locale} />
            <div className="mt-6 border-t border-navy/10 pt-6">
              <h2 className="font-display text-xl text-navy">{t("contact", { name })}</h2>
              <p className="mt-1 mb-5 text-sm text-muted-foreground">{tForms("inquirySubtitle")}</p>
              <InquiryForm compact agentName={agent.name.en} />
            </div>
          </div>
        </aside>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(agentJsonLd(agent, locale))} />
    </>
  );
}
