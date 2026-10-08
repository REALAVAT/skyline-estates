import { getTranslations, setRequestLocale } from "next-intl/server";
import { AgentCard } from "@/components/agent/agent-card";
import { Cta } from "@/components/home/cta";
import { Hero } from "@/components/home/hero";
import { Insights } from "@/components/home/insights";
import { PopularAreas } from "@/components/home/popular-areas";
import { Testimonials } from "@/components/home/testimonials";
import { WhyUs } from "@/components/home/why-us";
import { ProjectCard } from "@/components/project/project-card";
import { PropertyCard } from "@/components/property/property-card";
import { toCard } from "@/lib/property-summary";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { agents } from "@/data/agents";
import { projects } from "@/data/projects";
import { properties } from "@/data/properties";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/types";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  const featured = properties.filter((p) => p.featured).slice(0, 6);

  return (
    <>
      <Hero />

      <section id="featured" className="scroll-mt-20 py-24 lg:py-32">
        <div className="container-luxe">
          <SectionHeading
            eyebrow={t("featuredEyebrow")}
            title={t("featuredTitle")}
            subtitle={t("featuredSubtitle")}
            action={
              <Link href="/properties" className="btn-outline">
                {tc("viewAll")}
              </Link>
            }
          />
          <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {featured.map((property, i) => (
              <Reveal as="li" key={property.id} delay={(i % 3) * 0.08}>
                <PropertyCard property={toCard(property)} className="h-full" />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <PopularAreas />

      <section className="py-24 lg:py-32">
        <div className="container-luxe">
          <SectionHeading
            eyebrow={t("offPlanEyebrow")}
            title={t("offPlanTitle")}
            subtitle={t("offPlanSubtitle")}
            action={
              <Link href="/off-plan" className="btn-outline">
                {tc("viewAll")}
              </Link>
            }
          />
          <ul className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.slice(0, 3).map((project, i) => (
              <Reveal as="li" key={project.slug} delay={i * 0.08}>
                <ProjectCard project={project} locale={locale} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <WhyUs />

      <section className="py-24 lg:py-32">
        <div className="container-luxe">
          <SectionHeading
            eyebrow={t("agentsEyebrow")}
            title={t("agentsTitle")}
            subtitle={t("agentsSubtitle")}
            action={
              <Link href="/agents" className="btn-outline">
                {tc("viewAll")}
              </Link>
            }
          />
          <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {agents.slice(0, 4).map((agent, i) => (
              <Reveal as="li" key={agent.id} delay={i * 0.06}>
                <AgentCard agent={agent} locale={locale} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Testimonials />
      <Insights />
      <Cta />
    </>
  );
}
