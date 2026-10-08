"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ light = false, className }: { light?: boolean; className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");
  const next = locale === "en" ? "ar" : "en";

  return (
    <Link
      href={pathname}
      locale={next}
      hrefLang={next}
      lang={next}
      aria-label={`${t("language")}: ${next === "ar" ? "العربية" : "English"}`}
      onClick={(event) => {
        event.preventDefault();
        router.replace(`${pathname}${window.location.search}`, { locale: next, scroll: false });
      }}
      className={cn(
        "inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors",
        light ? "text-white hover:bg-white/10" : "text-navy hover:bg-sand",
        className,
      )}
    >
      <Languages className="size-4" aria-hidden="true" />
      <span className={next === "ar" ? "font-[family-name:var(--font-arabic)]" : "font-[family-name:var(--font-inter)]"}>
        {next === "ar" ? "العربية" : "English"}
      </span>
    </Link>
  );
}
