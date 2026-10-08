import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "start" | "center";
  action?: ReactNode;
  light?: boolean;
  as?: "h1" | "h2";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "start",
  action,
  light,
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-6",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className={cn("eyebrow", light && "text-gold-light")}>{eyebrow}</p>}
        <Tag className={cn("section-title mt-4", light && "text-white")}>{title}</Tag>
        {subtitle && (
          <p className={cn("mt-5 text-base leading-relaxed md:text-lg", light ? "text-white/75" : "text-muted-foreground")}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
