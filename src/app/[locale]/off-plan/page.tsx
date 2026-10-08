import type { Metadata } from "next";
import { BadgePercent, CalendarRange, ShieldCheck, Sparkles } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectCard } from "@/components/project/project-card";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { img } from "@/data/images";
import { developers, projects } from "@/data/projects";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/types";

export async function generateMetadata({ params }: PageProps<"/[locale]/off-plan">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, path: "/off-plan", title: t("offPlanTitle"), description: t("offPlanDescription") });
}

const whyIcons = [BadgePercent, CalendarRange, ShieldCheck, Sparkles];

export default async function OffPlanPage({ params }: PageProps<"/[locale]/off-plan">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "offPlan" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: tNav("offPlan"), href: "/off-plan" }]}
        eyebrow={tNav("offPlan")}
        title={t("title")}
        subtitle={t("subtitle")}
        image={img.glassTowers}
      />

      <section className="container-luxe py-16 sm:py-20">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal as="li" key={project.slug} delay={(i % 3) * 0.08}>
              <ProjectCard project={project} locale={locale} />
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="bg-navy py-16 text-white sm:py-24">
        <div className="container-luxe grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center">
          <SectionHeading light eyebrow={tNav("offPlan")} title={t("whyTitle")} />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(["why1", "why2", "why3", "why4"] as const).map((key, i) => {
              const Icon = whyIcons[i];
              return (
                <Reveal as="li" key={key} delay={i * 0.06} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <Icon className="size-6 text-gold" aria-hidden="true" />
                  <p className="mt-4 text-[15px] leading-relaxed text-white/85">{t(key)}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="container-luxe py-16 sm:py-20">
        <SectionHeading eyebrow={t("developer")} title={t("aboutDeveloper")} />
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {developers.map((dev) => (
            <li key={dev.id} className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
              <p className="font-display text-2xl text-navy">{dev.name}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{dev.description[locale]}</p>
              <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-navy/5 pt-4 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">{t("founded")}</dt>
                  <dd className="font-semibold text-navy">{dev.founded}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{t("delivered")}</dt>
                  <dd className="font-semibold text-navy">{dev.delivered}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
