import type { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AgentCard } from "@/components/agent/agent-card";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { agents } from "@/data/agents";
import { img } from "@/data/images";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/types";

export async function generateMetadata({ params }: PageProps<"/[locale]/agents">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, path: "/agents", title: t("agentsTitle"), description: t("agentsDescription") });
}

export default async function AgentsPage({ params }: PageProps<"/[locale]/agents">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "agentsPage" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: tNav("agents"), href: "/agents" }]}
        eyebrow={tNav("agents")}
        title={t("title")}
        subtitle={t("subtitle")}
        image={img.modernBlock}
      />
      <section className="container-luxe py-16 sm:py-20">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent, i) => (
            <Reveal as="li" key={agent.id} delay={(i % 3) * 0.08}>
              <AgentCard agent={agent} locale={locale} />
            </Reveal>
          ))}
        </ul>
        <div className="mt-14 flex flex-col items-start gap-5 rounded-2xl bg-sand/70 p-8 sm:flex-row sm:items-center">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-gold-deep">
            <Briefcase className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-display text-2xl text-navy">{t("joinTitle")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("joinText")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
