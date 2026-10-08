"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatPrice, formatPriceShort, type Currency } from "@/lib/format";
import type { PropertySummary } from "@/types";
import { TILE_ATTRIBUTION, TILE_MAX_ZOOM, TILE_URL } from "./tiles";

interface ListingsMapProps {
  properties: PropertySummary[];
  currency: Currency;
  activeId: string | null;
  onSelect: (id: string) => void;
  className?: string;
}

const DUBAI_CENTER: L.LatLngExpression = [25.13, 55.2];
// Price pins are ~64x26px pills, so pins closer than this would overlap.
const CLUSTER_DX = 68;
const CLUSTER_DY = 30;
const CLUSTER_MAX_ZOOM = 16;

function priceIcon(label: string, active: boolean) {
  return L.divIcon({
    className: `price-pin${active ? " price-pin--active" : ""}`,
    html: `<span class="price-pin__label">${label}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -34],
  });
}

function FitBounds({ properties }: { properties: PropertySummary[] }) {
  const map = useMap();
  const key = properties.map((p) => p.id).join(",");
  useEffect(() => {
    if (properties.length === 0) return;
    const size = map.getSize();
    if (size.x === 0 || size.y === 0) return;
    const bounds = L.latLngBounds(properties.map((p) => p.coordinates));
    map.flyToBounds(bounds, { padding: [48, 48], maxZoom: 14, duration: 0.6 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, map]);
  return null;
}

function InvalidateOnResize() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);
  return null;
}

function PriceMarker({
  property,
  currency,
  active,
  onSelect,
}: {
  property: PropertySummary;
  currency: Currency;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const locale = useLocale();
  const t = useTranslations("common");
  const icon = useMemo(
    () => priceIcon(formatPriceShort(property.price, currency), active),
    [property.price, currency, active],
  );

  return (
    <Marker
      position={property.coordinates}
      icon={icon}
      zIndexOffset={active ? 1000 : 0}
      keyboard
      title={property.title[locale]}
      eventHandlers={{ click: () => onSelect(property.id) }}
    >
      <Popup closeButton={false} autoPanPadding={[24, 24]}>
        <Link href={`/properties/${property.slug}`} className="block" dir={locale === "ar" ? "rtl" : "ltr"}>
          <span className="relative block aspect-[16/10] bg-sand">
            <Image src={property.images[0]} alt="" fill sizes="240px" className="object-cover" />
          </span>
          <span className="block p-3">
            <span className="block font-display text-lg font-semibold text-navy" dir="ltr">
              {formatPrice(property.price, currency, locale)}
              {property.purpose === "rent" && <span className="text-xs font-normal text-muted-foreground"> {t("perYear")}</span>}
            </span>
            <span className="mt-0.5 line-clamp-2 block text-[13px] leading-snug font-medium text-ink">
              {property.title[locale]}
            </span>
            <span className="mt-1 block text-xs text-muted-foreground">
              {t("beds", { count: property.beds })} · {t("baths", { count: property.baths })}
            </span>
          </span>
        </Link>
      </Popup>
    </Marker>
  );
}

function groupOverlapping(map: L.Map, zoom: number, properties: PropertySummary[], activeId: string | null) {
  if (zoom >= CLUSTER_MAX_ZOOM) return properties.map((p) => [p]);
  const groups: { members: PropertySummary[]; x: number; y: number; locked: boolean }[] = [];
  for (const p of properties) {
    const { x, y } = map.project(p.coordinates, zoom);
    const isActive = p.id === activeId;
    const group = isActive
      ? undefined
      : groups.find((g) => !g.locked && Math.abs(g.x - x) < CLUSTER_DX && Math.abs(g.y - y) < CLUSTER_DY);
    if (group) group.members.push(p);
    else groups.push({ members: [p], x, y, locked: isActive });
  }
  return groups.map((g) => g.members);
}

function ClusterMarker({ members, currency }: { members: PropertySummary[]; currency: Currency }) {
  const map = useMap();
  const t = useTranslations("listings");
  const bounds = useMemo(() => L.latLngBounds(members.map((p) => p.coordinates)), [members]);
  const minPrice = formatPriceShort(Math.min(...members.map((p) => p.price)), currency);
  const icon = useMemo(
    () =>
      L.divIcon({
        className: "price-pin price-pin--cluster",
        html: `<span class="price-pin__label"><span class="price-pin__count">${members.length}</span>${minPrice}+</span>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      }),
    [members.length, minPrice],
  );

  return (
    <Marker
      position={bounds.getCenter()}
      icon={icon}
      keyboard
      title={t("clusterTitle", { count: members.length, price: minPrice })}
      eventHandlers={{
        click: () => map.flyToBounds(bounds, { padding: [72, 72], maxZoom: CLUSTER_MAX_ZOOM, duration: 0.5 }),
      }}
    />
  );
}

function ClusteredMarkers({
  properties,
  currency,
  activeId,
  onSelect,
}: Pick<ListingsMapProps, "properties" | "currency" | "activeId" | "onSelect">) {
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());
  useMapEvents({ zoomend: () => setZoom(map.getZoom()) });
  const groups = useMemo(() => groupOverlapping(map, zoom, properties, activeId), [map, zoom, properties, activeId]);

  return groups.map((members) =>
    members.length === 1 ? (
      <PriceMarker
        key={members[0].id}
        property={members[0]}
        currency={currency}
        active={members[0].id === activeId}
        onSelect={onSelect}
      />
    ) : (
      <ClusterMarker key={members.map((p) => p.id).join("-")} members={members} currency={currency} />
    ),
  );
}

export default function ListingsMap({ properties, currency, activeId, onSelect, className }: ListingsMapProps) {
  const t = useTranslations("listings");
  return (
    <div className={className} dir="ltr" role="region" aria-label={t("mapLabel")}>
      <MapContainer center={DUBAI_CENTER} zoom={11} scrollWheelZoom className="size-full" zoomControl>
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={TILE_MAX_ZOOM} />
        <FitBounds properties={properties} />
        <InvalidateOnResize />
        <ClusteredMarkers properties={properties} currency={currency} activeId={activeId} onSelect={onSelect} />
      </MapContainer>
    </div>
  );
}
