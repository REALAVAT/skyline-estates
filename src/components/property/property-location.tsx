"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Building2, GraduationCap, HeartPulse, Landmark, ShoppingBag, TrainFront, Trees, Waves } from "lucide-react";
import type { LatLng, PlaceKind } from "@/types";

const LocationMap = dynamic(() => import("@/components/map/location-map"), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-sand" />,
});

export interface NearbyPlace {
  id: string;
  name: string;
  kind: PlaceKind;
  kindLabel: string;
  distance: string;
  coordinates: LatLng;
}

const icons: Record<PlaceKind, typeof Building2> = {
  metro: TrainFront,
  mall: ShoppingBag,
  school: GraduationCap,
  hospital: HeartPulse,
  beach: Waves,
  park: Trees,
  landmark: Landmark,
};

export function PropertyLocation({
  center,
  places,
  mapLabel,
  homeLabel,
  nearbyTitle,
}: {
  center: LatLng;
  places: NearbyPlace[];
  mapLabel: string;
  homeLabel: string;
  nearbyTitle: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div className="h-[320px] overflow-hidden rounded-2xl ring-1 ring-navy/5 sm:h-[400px]">
        <LocationMap
          center={center}
          label={mapLabel}
          homeLabel={homeLabel}
          places={places.map(({ id, name, coordinates }) => ({ id, name, coordinates }))}
          activePlaceId={active}
          className="size-full"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold tracking-wide text-navy uppercase rtl:tracking-normal">{nearbyTitle}</h3>
        <ol className="mt-4 divide-y divide-navy/5">
          {places.map((place, i) => {
            const Icon = icons[place.kind];
            return (
              <li
                key={place.id}
                onMouseEnter={() => setActive(place.id)}
                onMouseLeave={() => setActive(null)}
                className="flex items-center gap-3 py-3"
              >
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-full border-2 border-gold text-[11px] font-bold transition-colors ${
                    active === place.id ? "bg-gold text-navy" : "bg-ivory text-navy"
                  }`}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink">{place.name}</span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Icon className="size-3.5 text-gold-deep" aria-hidden="true" />
                    {place.kindLabel}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold text-navy" dir="ltr">
                  {place.distance}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
