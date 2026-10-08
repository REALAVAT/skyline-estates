"use client";

import type { RefObject } from "react";
import { Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { site } from "@/data/site";
import { Link } from "@/i18n/navigation";
import { CurrencySwitcher } from "./currency-switcher";
import { LocaleSwitcher } from "./locale-switcher";
import { Logo } from "./logo";
import type { NavLink } from "./header";

export default function MobileMenu({
  open,
  onOpenChange,
  links,
  returnFocus,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  links: readonly NavLink[];
  returnFocus: RefObject<HTMLButtonElement | null>;
}) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        finalFocus={returnFocus}
        closeLabel={tc("close")}
        side={locale === "ar" ? "left" : "right"}
        className="w-[88vw] max-w-sm gap-0 border-0 bg-ivory p-0"
      >
        <div className="flex h-[72px] items-center border-b border-navy/5 px-6">
          <SheetTitle className="sr-only">{t("mainNav")}</SheetTitle>
          <Logo />
        </div>
        <nav aria-label={t("mainNav")} className="flex-1 overflow-y-auto px-6 py-6">
          <ul className="space-y-1">
            {[{ href: "/", key: "home" } as const, { href: "/properties", key: "properties" } as const, ...links].map(
              (link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className="flex items-center justify-between border-b border-navy/5 py-3.5 font-display text-2xl text-navy rtl:text-xl"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ),
            )}
            <li>
              <Link
                href="/compare"
                onClick={close}
                className="flex items-center justify-between border-b border-navy/5 py-3.5 font-display text-2xl text-navy rtl:text-xl"
              >
                {t("compare")}
              </Link>
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CurrencySwitcher />
            <LocaleSwitcher />
          </div>
        </nav>
        <div className="space-y-3 border-t border-navy/5 p-6">
          <Link href="/list-your-property" onClick={close} className="btn-navy w-full">
            {t("listProperty")}
          </Link>
          <a href={site.phoneHref} className="btn-outline w-full">
            <Phone className="size-4" aria-hidden="true" />
            <span dir="ltr">{site.phone}</span>
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
