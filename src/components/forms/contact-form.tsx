"use client";

import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { contactSchema, contactSubjects, type ContactSubject, type ContactValues } from "@/lib/schemas";
import { Field, FormSuccess, Honeypot, SubmitButton, fieldProps, useFormSubmit } from "./form-kit";

export function ContactForm({ defaultSubject }: { defaultSubject?: ContactSubject }) {
  const t = useTranslations("forms");
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const { done, setDone, submit } = useFormSubmit<ContactValues>("contact");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: defaultSubject ?? "buying", message: "", website: "" },
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
    <form onSubmit={handleSubmit(async (values) => void (await submit(values)))} noValidate className="relative space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id={id("name")} label={t("name")} error={errors.name}>
          <input className="field" autoComplete="name" {...fieldProps(id("name"), errors.name)} {...register("name")} />
        </Field>
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
        <Field id={id("subject")} label={t("subject")} error={errors.subject}>
          <select className="field" {...fieldProps(id("subject"), errors.subject)} {...register("subject")}>
            {contactSubjects.map((s) => (
              <option key={s} value={s}>
                {t(`subjects.${s}`)}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field id={id("message")} label={t("message")} error={errors.message}>
        <textarea className="field min-h-36" rows={5} {...fieldProps(id("message"), errors.message)} {...register("message")} />
      </Field>
      <Honeypot register={register("website")} />
      <SubmitButton pending={isSubmitting} label={t("submit")} className="sm:w-auto sm:px-10" />
      <p className="text-[11px] leading-relaxed text-muted-foreground">{t("privacy")}</p>
    </form>
  );
}
