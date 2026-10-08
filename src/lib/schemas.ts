import { z } from "zod";
import { areaSlugs } from "@/data/areas";
import { propertyTypes } from "./listings";

/** Error messages are translation keys under `forms.errors`. */
export type FormErrorKey = "required" | "name" | "email" | "phone" | "message" | "number";

const name = z.string().trim().min(2, "name").max(80, "name");
const email = z.string().trim().min(1, "required").email("email").max(120, "email");
const phone = z
  .string()
  .trim()
  .max(24, "phone")
  .refine((v) => v === "" || /^\+?[\d\s()-]{7,20}$/.test(v), "phone");
const requiredPhone = phone.refine((v) => v.length > 0, "required");
const message = z.string().trim().min(10, "message").max(2000, "message");
const honeypot = z.string().max(0).optional();

export const contactSubjects = ["buying", "selling", "renting", "offplan", "other"] as const;
export type ContactSubject = (typeof contactSubjects)[number];

export const contactSchema = z.object({
  name,
  email,
  phone,
  subject: z.enum(contactSubjects, "required"),
  message,
  website: honeypot,
});

export const inquirySchema = z.object({
  name,
  email,
  phone,
  message,
  propertyRef: z.string().max(40).optional(),
  propertyTitle: z.string().max(200).optional(),
  agentName: z.string().max(80).optional(),
  website: honeypot,
});

const optionalNumber = z
  .string()
  .trim()
  .refine((v) => v === "" || (/^\d[\d,]*$/.test(v) && Number(v.replace(/,/g, "")) > 0), "number");

export const valuationSchema = z.object({
  name,
  email,
  phone: requiredPhone,
  goal: z.enum(["sell", "rent"]),
  propertyType: z.enum(propertyTypes as [string, ...string[]], "required"),
  area: z.enum(areaSlugs as [string, ...string[]], "required"),
  bedrooms: z.string().min(1, "required"),
  size: optionalNumber.refine((v) => v !== "", "required"),
  expectedPrice: optionalNumber,
  details: z.string().trim().max(2000).optional(),
  website: honeypot,
});

export type ContactValues = z.infer<typeof contactSchema>;
export type InquiryValues = z.infer<typeof inquirySchema>;
export type ValuationValues = z.infer<typeof valuationSchema>;

export const submissionSchema = z.discriminatedUnion("kind", [
  contactSchema.extend({ kind: z.literal("contact") }),
  inquirySchema.extend({ kind: z.literal("inquiry") }),
  valuationSchema.extend({ kind: z.literal("valuation") }),
]);

export type Submission = z.infer<typeof submissionSchema>;
