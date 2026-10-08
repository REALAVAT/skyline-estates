"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { LatLng } from "@/types";
import { TILE_ATTRIBUTION, TILE_MAX_ZOOM, TILE_URL } from "./tiles";

export interface MapPlace {
  id: string;
  name: string;
  coordinates: LatLng;
}

interface LocationMapProps {
  center: LatLng;
  label: string;
  homeLabel: string;
  places?: MapPlace[];
  activePlaceId?: string | null;
  zoom?: number;
  className?: string;
}

const homeIcon = L.divIcon({
  className: "home-pin",
  html: '<span class="home-pin__dot"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg></span>',
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

const placeIcon = (index: number, active: boolean) =>
  L.divIcon({
    className: `place-pin${active ? " place-pin--active" : ""}`,
    html: `<span class="place-pin__dot">${index + 1}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

function FitAll({ center, places }: { center: LatLng; places: MapPlace[] }) {
  const map = useMap();
  useEffect(() => {
    if (places.length === 0) return;
    const size = map.getSize();
    if (size.x === 0 || size.y === 0) return;
    map.fitBounds(L.latLngBounds([center, ...places.map((p) => p.coordinates)]), { padding: [40, 40], maxZoom: 15 });
  }, [center, places, map]);
  return null;
}

export default function LocationMap({
  center,
  label,
  homeLabel,
  places = [],
  activePlaceId,
  zoom = 14,
  className,
}: LocationMapProps) {
  return (
    <div className={className} dir="ltr" role="region" aria-label={label}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="size-full">
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={TILE_MAX_ZOOM} />
        <FitAll center={center} places={places} />
        <Marker position={center} icon={homeIcon} title={homeLabel} zIndexOffset={1000} keyboard={false} />
        {places.map((place, i) => (
          <Marker
            key={place.id}
            position={place.coordinates}
            icon={placeIcon(i, place.id === activePlaceId)}
            title={place.name}
            keyboard={false}
            zIndexOffset={place.id === activePlaceId ? 900 : 0}
          >
            <Tooltip direction="top" offset={[0, -16]}>
              {place.name}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
