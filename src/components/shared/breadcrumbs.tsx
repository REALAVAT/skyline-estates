import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { jsonLd, localizedUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";

export interface Crumb {
  label: string;
  href?: string;
}

export async function Breadcrumbs({
  items,
  locale,
  light = false,
  className,
}: {
  items: Crumb[];
  locale: Locale;
  light?: boolean;
  className?: string;
}) {
  const t = await getTranslations({ locale, namespace: "common" });
  const all: Crumb[] = [{ label: t("home"), href: "/" }, ...items];
  const data = breadcrumbJsonLd(
    all.map((c) => ({ name: c.label, url: localizedUrl(locale, c.href === "/" ? "" : (c.href ?? "")) })),
  );

  return (
    <>
      <nav aria-label={t("breadcrumb")} className={cn("text-xs sm:text-sm", className)}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((crumb, i) => {
            const last = i === all.length - 1;
            return (
              <li key={`${crumb.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
                {crumb.href && !last ? (
                  <Link
                    href={crumb.href}
                    className={cn(
                      "transition-colors",
                      light ? "text-white/75 hover:text-white" : "text-muted-foreground hover:text-navy",
                    )}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    aria-current={last ? "page" : undefined}
                    className={cn("truncate font-medium", light ? "text-white" : "text-navy")}
                  >
                    {crumb.label}
                  </span>
                )}
                {!last && (
                  <ChevronRight
                    className={cn("size-3.5 shrink-0 rtl-flip", light ? "text-white/50" : "text-muted-foreground/60")}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(data)} />
    </>
  );
}
