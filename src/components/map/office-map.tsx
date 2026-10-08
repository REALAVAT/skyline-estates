"use client";

import dynamic from "next/dynamic";
import type { LatLng } from "@/types";

const LocationMap = dynamic(() => import("./location-map"), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-sand" />,
});

export function OfficeMap({ center, label, homeLabel, className }: { center: LatLng; label: string; homeLabel: string; className?: string }) {
  return <LocationMap center={center} label={label} homeLabel={homeLabel} zoom={15} className={className} />;
}
