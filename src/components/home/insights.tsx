import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { insights } from "@/data/insights";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/types";

export async function Insights() {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const locale = (await getLocale()) as Locale;

  return (
    <section className="bg-sand py-24 lg:py-32">
      <div className="container-luxe">
        <SectionHeading eyebrow={t("insightsEyebrow")} title={t("insightsTitle")} subtitle={t("insightsSubtitle")} />
        <ul className="mt-14 grid gap-8 md:grid-cols-3">
          {insights.map((post, i) => (
            <Reveal as="li" key={post.slug} delay={i * 0.08}>
              <article className="group relative flex h-full flex-col">
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-navy/10">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 30vw, 100vw"
                    className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-luxe)] group-hover:scale-105"
                  />
                  <span className="absolute start-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy">
                    {post.category[locale]}
                  </span>
                </div>
                <p className="mt-5 text-xs text-muted-foreground">
                  <time dateTime={post.date}>{formatDate(post.date, locale)}</time> · {tc("minutesRead", { count: post.readMinutes })}
                </p>
                <h3 className="mt-2 font-display text-2xl leading-snug text-navy transition-colors group-hover:text-gold-deep rtl:text-xl">
                  <Link href={post.href} className="after:absolute after:inset-0 after:content-['']">
                    {post.title[locale]}
                  </Link>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt[locale]}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
