"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Heart, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { site } from "@/data/site";
import { Link, usePathname } from "@/i18n/navigation";
import { useFavorites } from "@/lib/stores";
import { cn } from "@/lib/utils";
import { CurrencySwitcher } from "./currency-switcher";
import { LocaleSwitcher } from "./locale-switcher";
import { Logo } from "./logo";

const MobileMenu = dynamic(() => import("./mobile-menu"), { ssr: false });

export type NavLink = (typeof links)[number];

const links = [
  { href: "/properties?purpose=buy", key: "buy", match: "/properties" },
  { href: "/properties?purpose=rent", key: "rent", match: "/properties" },
  { href: "/off-plan", key: "offPlan", match: "/off-plan" },
  { href: "/areas", key: "areas", match: "/areas" },
  { href: "/agents", key: "agents", match: "/agents" },
  { href: "/contact", key: "contact", match: "/contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { ids: favorites } = useFavorites();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuLoaded, setMenuLoaded] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  const overHero = pathname === "/";
  const transparent = overHero && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "inset-x-0 top-0 z-40 transition-[background-color,box-shadow,color] duration-500",
        overHero ? "fixed" : "sticky",
        transparent
          ? "bg-transparent"
          : "border-b border-navy/5 bg-ivory/90 shadow-[0_1px_0_rgb(11_31_58/0.03)] backdrop-blur-xl",
      )}
    >
      <div className="container-luxe flex h-[72px] items-center justify-between gap-4 lg:h-20">
        <Link href="/" className="rounded-lg" aria-label={`${site.name} – ${t("home")}`}>
          <Logo light={transparent} />
        </Link>

        <nav aria-label={t("mainNav")} className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => {
              const active =
                link.match === "/properties" ? false : pathname.startsWith(link.match);
              return (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-10 items-center rounded-full px-4 text-sm font-medium transition-colors",
                      transparent ? "text-white/90 hover:text-white" : "text-ink/80 hover:text-navy",
                      "after:absolute after:inset-x-4 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100 rtl:after:origin-right",
                    )}
                  >
                    {t(link.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <CurrencySwitcher light={transparent} />
            <LocaleSwitcher light={transparent} />
          </div>
          <Link
            href="/favorites"
            aria-label={`${t("favorites")} (${favorites.length})`}
            className={cn(
              "relative inline-flex size-10 items-center justify-center rounded-full transition-colors",
              transparent ? "text-white hover:bg-white/10" : "text-navy hover:bg-sand",
            )}
          >
            <Heart className="size-5" aria-hidden="true" />
            {favorites.length > 0 && (
              <span className="absolute end-1 top-1 grid min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] leading-4 font-bold text-navy">
                {favorites.length}
              </span>
            )}
          </Link>
          <Link
            href="/list-your-property"
            className={cn(
              "hidden h-11 items-center rounded-full px-5 text-sm font-semibold transition-all duration-300 lg:inline-flex",
              transparent ? "bg-white text-navy hover:bg-gold-light" : "bg-navy text-ivory hover:bg-navy-700",
            )}
          >
            {t("listProperty")}
          </Link>

          <button
            ref={menuButton}
            type="button"
            aria-label={t("menu")}
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => {
              setMenuLoaded(true);
              setOpen(true);
            }}
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-full transition-colors xl:hidden",
              transparent ? "text-white hover:bg-white/10" : "text-navy hover:bg-sand",
            )}
          >
            <Menu className="size-6" aria-hidden="true" />
          </button>
          {menuLoaded && <MobileMenu open={open} onOpenChange={setOpen} links={links} returnFocus={menuButton} />}
        </div>
      </div>
    </header>
  );
}
