import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={cn("size-9 shrink-0", className)}>
      <rect width="64" height="64" rx="14" fill="currentColor" />
      <path d="M14 48h36" stroke="#c8a96a" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M18 48V30h6v18M27 48V20h6v28M36 48V12l6 6v30M45 48V34h3v14"
        fill="none"
        stroke="#e6d3a6"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <LogoMark className={light ? "text-white/10" : "text-navy"} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-[family-name:var(--font-cormorant)] text-[1.45rem] font-semibold tracking-wide",
            light ? "text-white" : "text-navy",
          )}
        >
          Skyline
        </span>
        <span
          className={cn(
            "mt-0.5 text-[0.6rem] font-semibold tracking-[0.42em] uppercase",
            light ? "text-gold-light" : "text-gold-deep",
          )}
        >
          Estates
        </span>
      </span>
    </span>
  );
}
