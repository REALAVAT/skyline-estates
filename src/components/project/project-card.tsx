import Image from "next/image";
import { ArrowUpRight, CalendarClock, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Price } from "@/components/shared/price";
import { getArea } from "@/data/areas";
import { getDeveloper } from "@/data/projects";
import { Link } from "@/i18n/navigation";
import type { Locale, Project } from "@/types";
import { PaymentPlanBar } from "./payment-plan-bar";

export async function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "offPlan" });
  const area = getArea(project.area);
  const developer = getDeveloper(project.developerId);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-navy/5 transition-shadow duration-500 hover:shadow-lift">
      <div className="relative aspect-[16/11] overflow-hidden bg-sand">
        <Image
          src={project.image}
          alt={project.name}
          fill
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover transform-gpu transition-transform duration-[1.2s] ease-[var(--ease-luxe)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
        <span className="absolute start-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy">
          {t(`status.${project.status}`)}
        </span>
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between text-white">
          <div>
            <p className="text-xs text-white/80">{developer?.name}</p>
            <h3 className="mt-1 font-display text-2xl text-white rtl:text-xl">{project.name}</h3>
          </div>
          <span className="grid size-10 place-items-center rounded-full bg-white/15 backdrop-blur transition-colors group-hover:bg-gold group-hover:text-navy">
            <ArrowUpRight className="size-5 rtl:-scale-x-100" aria-hidden="true" />
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-gold-deep" aria-hidden="true" />
            {area?.name[locale]}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarClock className="size-3.5 text-gold-deep" aria-hidden="true" />
            <span>
              {t("handover")}: <span dir="ltr">{project.handover}</span>
            </span>
          </span>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">{t("startingFrom")}</p>
            <Price aed={project.startingPrice} className="font-display text-2xl font-semibold text-navy rtl:text-xl" />
          </div>
          <p className="text-end text-xs text-muted-foreground">
            {project.unitTypes[locale]}
            <br />
            <span className="font-medium text-ink">
              {t("bedrooms")}: <span dir="ltr">{project.bedrooms}</span>
            </span>
          </p>
        </div>
        <div className="mt-auto border-t border-navy/5 pt-4">
          <p className="mb-2 text-xs font-semibold tracking-wide text-ink/70 uppercase rtl:tracking-normal">{t("paymentPlan")}</p>
          <PaymentPlanBar plan={project.paymentPlan} locale={locale} compact />
        </div>
      </div>
      <Link
        href={`/off-plan/${project.slug}`}
        className="absolute inset-0 rounded-2xl focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
        aria-label={`${t("viewProject")}: ${project.name}`}
      />
    </article>
  );
}
