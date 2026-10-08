"use client";

// Sonner is only needed once someone triggers a toast, so keep it out of the initial bundle.
const load = () => import("sonner").then((mod) => mod.toast);

export const toast = Object.assign((message: string) => void load().then((t) => t(message)), {
  success: (message: string) => void load().then((t) => t.success(message)),
  error: (message: string) => void load().then((t) => t.error(message)),
});
