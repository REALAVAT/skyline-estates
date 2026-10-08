import type { Metadata } from "next";
import { BadgeCheck, Camera, Handshake, LineChart } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ValuationForm } from "@/components/forms/valuation-form";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { img } from "@/data/images";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/types";

export async function generateMetadata({ params }: PageProps<"/[locale]/list-your-property">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, path: "/list-your-property", title: t("listTitle"), description: t("listDescription") });
}

const steps = [
  { key: "step1", icon: LineChart },
  { key: "step2", icon: Camera },
  { key: "step3", icon: BadgeCheck },
  { key: "step4", icon: Handshake },
] as const;

export default async function ListPropertyPage({ params }: PageProps<"/[locale]/list-your-property">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const [t, tNav, tForms] = await Promise.all([
    getTranslations({ locale, namespace: "listPage" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "forms" }),
  ]);

  const stats = [
    { value: "38", label: t("statDays") },
    { value: "98.6%", label: t("statAsking") },
    { value: "1.2M+", label: t("statPortal") },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: tNav("listProperty"), href: "/list-your-property" }]}
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image={img.villaInfinity}
      >
        <dl className="flex flex-wrap gap-x-12 gap-y-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dd className="font-display text-4xl text-gold-light" dir="ltr">
                {s.value}
              </dd>
              <dt className="mt-1 text-sm text-white/70">{s.label}</dt>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="container-luxe grid gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <ol className="space-y-5">
          {steps.map(({ key, icon: Icon }, i) => (
            <Reveal as="li" key={key} delay={i * 0.06} className="flex gap-5 rounded-2xl bg-white p-6 ring-1 ring-navy/5">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-navy text-gold-light">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold text-gold-deep" dir="ltr" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-1 font-display text-xl text-navy">{t(`${key}Title`)}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(`${key}Text`)}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        <div id="valuation" className="scroll-mt-28 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5 sm:p-10">
          <h2 className="font-display text-3xl text-navy">{tForms("valuationTitle")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{tForms("valuationSubtitle")}</p>
          <div className="mt-8">
            <ValuationForm />
          </div>
        </div>
      </section>
    </>
  );
}
