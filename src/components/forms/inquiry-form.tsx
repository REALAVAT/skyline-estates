"use client";

import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { inquirySchema, type InquiryValues } from "@/lib/schemas";
import { Field, FormSuccess, Honeypot, SubmitButton, fieldProps, useFormSubmit } from "./form-kit";

interface InquiryFormProps {
  propertyRef?: string;
  propertyTitle?: string;
  agentName?: string;
  defaultMessage?: string;
  compact?: boolean;
}

export function InquiryForm({ propertyRef, propertyTitle, agentName, defaultMessage, compact }: InquiryFormProps) {
  const t = useTranslations("forms");
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const { done, setDone, submit } = useFormSubmit<InquiryValues>("inquiry");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { name: "", email: "", phone: "", message: defaultMessage ?? "", propertyRef, propertyTitle, agentName, website: "" },
  });

  if (done) {
    return (
      <FormSuccess
        onReset={() => {
          reset();
          setDone(false);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(async (values) => void (await submit(values)))} noValidate className="relative space-y-4">
      <Field id={id("name")} label={t("name")} error={errors.name}>
        <input className="field" autoComplete="name" {...fieldProps(id("name"), errors.name)} {...register("name")} />
      </Field>
      <div className={compact ? "space-y-4" : "grid grid-cols-1 gap-4 sm:grid-cols-2"}>
        <Field id={id("email")} label={t("email")} error={errors.email}>
          <input
            className="field"
            type="email"
            autoComplete="email"
            dir="ltr"
            {...fieldProps(id("email"), errors.email)}
            {...register("email")}
          />
        </Field>
        <Field id={id("phone")} label={t("phone")} error={errors.phone} optional>
          <input
            className="field"
            type="tel"
            autoComplete="tel"
            dir="ltr"
            placeholder="+971"
            {...fieldProps(id("phone"), errors.phone)}
            {...register("phone")}
          />
        </Field>
      </div>
      <Field id={id("message")} label={t("message")} error={errors.message}>
        <textarea
          className="field min-h-28 resize-y py-3"
          rows={4}
          {...fieldProps(id("message"), errors.message)}
          {...register("message")}
        />
      </Field>
      <Honeypot register={register("website")} />
      <SubmitButton pending={isSubmitting} label={t("requestViewing")} />
      <p className="text-[11px] leading-relaxed text-muted-foreground">{t("privacy")}</p>
    </form>
  );
}
