import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/data/site";
import { submissionSchema, type Submission } from "@/lib/schemas";

const titles: Record<Submission["kind"], string> = {
  contact: "New contact enquiry",
  inquiry: "New property enquiry",
  valuation: "New valuation request",
};

const labels: Record<string, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  subject: "Subject",
  message: "Message",
  propertyRef: "Property reference",
  propertyTitle: "Property",
  agentName: "Agent",
  goal: "Goal",
  propertyType: "Property type",
  area: "Area",
  bedrooms: "Bedrooms",
  size: "Size (sq ft)",
  expectedPrice: "Expected price (AED)",
  details: "Details",
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

function renderEmail(data: Submission) {
  const rows = Object.entries(data)
    .filter(([key, value]) => key in labels && typeof value === "string" && value.trim() !== "")
    .map(
      ([key, value]) =>
        `<tr><td style="padding:8px 16px 8px 0;color:#6b7280;vertical-align:top;white-space:nowrap">${labels[key]}</td><td style="padding:8px 0;color:#0b1f3a">${escapeHtml(String(value)).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");
  return `<div style="font-family:Inter,Arial,sans-serif;font-size:14px"><h2 style="color:#0b1f3a;font-weight:600">${titles[data.kind]}</h2><table style="border-collapse:collapse">${rows}</table></div>`;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (typeof body === "object" && body !== null && "website" in body && body.website) {
    return NextResponse.json({ ok: true });
  }

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation", issues: parsed.error.issues }, { status: 422 });
  }

  const data = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: true, demo: true });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL || `${site.name} <onboarding@resend.dev>`,
    to: (process.env.CONTACT_TO_EMAIL || site.email).split(",").map((v) => v.trim()),
    replyTo: data.email,
    subject: `${titles[data.kind]} – ${data.name}`,
    html: renderEmail(data),
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
