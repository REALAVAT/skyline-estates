"use client";

import { useState, type ReactNode } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "@/lib/toast";
import type { FieldError } from "react-hook-form";
import type { Submission } from "@/lib/schemas";
import { cn } from "@/lib/utils";

export function Field({
  id,
  label,
  error,
  optional,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: FieldError;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const t = useTranslations("forms.errors");
  const key = error?.message as Parameters<typeof t>[0] | undefined;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-navy">
        {label}
        {!optional && (
          <span className="text-gold-deep" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-destructive" role="alert">
          {key && ["required", "name", "email", "phone", "message", "number"].includes(key) ? t(key) : t("required")}
        </p>
      )}
    </div>
  );
}

export function fieldProps(id: string, error?: FieldError) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  } as const;
}

type Kind = Submission["kind"];

export function useFormSubmit<T extends object>(kind: Kind) {
  const t = useTranslations("forms");
  const [done, setDone] = useState(false);

  const submit = async (values: T) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, kind }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || !json.ok) throw new Error("request_failed");
      setDone(true);
      return true;
    } catch {
      toast.error(t("error"));
      return false;
    }
  };

  return { done, setDone, submit };
}

export function SubmitButton({ pending, label, className }: { pending: boolean; label: string; className?: string }) {
  const t = useTranslations("forms");
  return (
    <button type="submit" disabled={pending} className={cn("btn-navy w-full disabled:opacity-70", className)}>
      {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {pending ? t("sending") : label}
    </button>
  );
}

export function FormSuccess({ text, onReset }: { text?: string; onReset: () => void }) {
  const t = useTranslations("forms");
  return (
    <div className="flex flex-col items-center py-8 text-center" role="status">
      <span className="grid size-16 place-items-center rounded-full bg-gold/15 text-gold-deep">
        <CheckCircle2 className="size-8" aria-hidden="true" />
      </span>
      <h3 className="mt-5 font-display text-2xl text-navy">{t("successTitle")}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{text ?? t("successText")}</p>
      <button type="button" onClick={onReset} className="btn-outline mt-6">
        {t("sendAnother")}
      </button>
    </div>
  );
}

/** Visually hidden trap field; bots fill it, people never see it. */
export function Honeypot({ register }: { register: object }) {
  return (
    <div className="absolute -start-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
      <label>
        Website
        <input type="text" tabIndex={-1} autoComplete="off" {...register} />
      </label>
    </div>
  );
}
