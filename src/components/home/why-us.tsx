import Image from "next/image";
import { BadgeCheck, ChartNoAxesCombined, Handshake, KeyRound } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/shared/reveal";
import { img } from "@/data/images";
import { site } from "@/data/site";
import { CountUp } from "./count-up";

export async function WhyUs() {
  const t = await getTranslations("home");
  const locale = await getLocale();

  const items = [
    { Icon: BadgeCheck, title: t("why1Title"), text: t("why1Text") },
    { Icon: ChartNoAxesCombined, title: t("why2Title"), text: t("why2Text") },
    { Icon: Handshake, title: t("why3Title"), text: t("why3Text") },
    { Icon: KeyRound, title: t("why4Title"), text: t("why4Text") },
  ];

  const stats = [
    { value: site.stats.yearsActive, suffix: "+", label: t("statYears") },
    { value: site.stats.propertiesSold, suffix: "+", label: t("statSold") },
    { value: site.stats.salesVolumeBillions, decimals: 1, suffix: locale === "ar" ? " مليار" : "B", label: t("statVolume") },
    { value: site.stats.clientSatisfaction, suffix: "%", label: t("statSatisfaction") },
  ];

  return (
    <section className="relative overflow-hidden bg-navy py-24 text-white lg:py-32">
      <Image src={img.towerDetail} alt="" fill sizes="100vw" className="object-cover opacity-[0.12]" />
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/95 to-navy-800/90" />
      <div className="container-luxe relative grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <Reveal>
            <p className="eyebrow text-gold-light">{t("whyEyebrow")}</p>
            <h2 className="section-title mt-4 text-white">{t("whyTitle")}</h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">{t("whySubtitle")}</p>
          </Reveal>
          <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="flex flex-col border-s border-gold/40 ps-5">
                <dt className="text-sm text-white/65">{s.label}</dt>
                <dd className="mt-2 order-first font-display text-4xl font-medium text-gold-light sm:text-5xl rtl:text-4xl">
                  <CountUp to={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} locale={locale} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map(({ Icon, title, text }, i) => (
            <Reveal
              as="li"
              key={title}
              delay={i * 0.08}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition-colors duration-500 hover:border-gold/40 hover:bg-white/[0.07]"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-gold/15 text-gold-light">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-6 font-sans text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
