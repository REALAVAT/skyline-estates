"use client";

import { useId } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { areaOptions } from "@/data/area-names";
import { bedOptions, propertyTypes } from "@/lib/listings";
import { valuationSchema, type ValuationValues } from "@/lib/schemas";
import type { Locale } from "@/types";
import { Field, FormSuccess, Honeypot, SubmitButton, fieldProps, useFormSubmit } from "./form-kit";

export function ValuationForm() {
  const t = useTranslations("forms");
  const tTypes = useTranslations("types");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const { done, setDone, submit } = useFormSubmit<ValuationValues>("valuation");

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ValuationValues>({
    resolver: zodResolver(valuationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      goal: "sell",
      propertyType: "",
      area: "",
      bedrooms: "",
      size: "",
      expectedPrice: "",
      details: "",
      website: "",
    },
  });
  const goal = useWatch({ control, name: "goal" });

  if (done) {
    return (
      <FormSuccess
        text={t("valuationSuccess")}
        onReset={() => {
          reset();
          setDone(false);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(async (values) => void (await submit(values)))} noValidate className="relative space-y-5">
      <fieldset>
        <legend className="text-sm font-semibold text-navy">{t("goal")}</legend>
        <div className="mt-2 inline-flex rounded-full bg-sand p-1" role="group">
          {(["sell", "rent"] as const).map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={goal === g}
              onClick={() => setValue("goal", g)}
              className="h-10 rounded-full px-6 text-sm font-semibold text-ink/70 transition-colors aria-pressed:bg-navy aria-pressed:text-ivory"
            >
              {g === "sell" ? t("goalSell") : t("goalRent")}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id={id("propertyType")} label={t("propertyType")} error={errors.propertyType}>
          <select className="field" {...fieldProps(id("propertyType"), errors.propertyType)} {...register("propertyType")}>
            <option value="">{t("selectOption")}</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {tTypes(type)}
              </option>
            ))}
          </select>
        </Field>
        <Field id={id("area")} label={t("area")} error={errors.area}>
          <select className="field" {...fieldProps(id("area"), errors.area)} {...register("area")}>
            <option value="">{t("selectOption")}</option>
            {areaOptions.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name[locale]}
              </option>
            ))}
          </select>
        </Field>
        <Field id={id("bedrooms")} label={t("bedrooms")} error={errors.bedrooms}>
          <select className="field" {...fieldProps(id("bedrooms"), errors.bedrooms)} {...register("bedrooms")}>
            <option value="">{t("selectOption")}</option>
            {bedOptions.map((b) => (
              <option key={b} value={b}>
                {b === "5" ? "5+" : tc("beds", { count: Number(b) })}
              </option>
            ))}
          </select>
        </Field>
        <Field id={id("size")} label={t("size")} error={errors.size}>
          <input className="field" inputMode="numeric" dir="ltr" {...fieldProps(id("size"), errors.size)} {...register("size")} />
        </Field>
        <Field id={id("expectedPrice")} label={t("expectedPrice")} error={errors.expectedPrice} optional className="sm:col-span-2">
          <input
            className="field"
            inputMode="numeric"
            dir="ltr"
            {...fieldProps(id("expectedPrice"), errors.expectedPrice)}
            {...register("expectedPrice")}
          />
        </Field>
      </div>

      <div className="grid gap-5 border-t border-navy/10 pt-5 sm:grid-cols-2">
        <Field id={id("name")} label={t("name")} error={errors.name} className="sm:col-span-2">
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
        <Field id={id("phone")} label={t("phone")} error={errors.phone}>
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
      <Field id={id("details")} label={t("details")} error={errors.details} optional>
        <textarea className="field" rows={4} {...fieldProps(id("details"), errors.details)} {...register("details")} />
      </Field>
      <Honeypot register={register("website")} />
      <SubmitButton pending={isSubmitting} label={t("submitValuation")} />
      <p className="text-[11px] leading-relaxed text-muted-foreground">{t("privacy")}</p>
    </form>
  );
}
