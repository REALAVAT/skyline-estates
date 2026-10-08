"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import Image from "next/image";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
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

export default function ListingsMap({ properties, currency, activeId, onSelect, className }: ListingsMapProps) {
  const t = useTranslations("listings");
  return (
    <div className={className} dir="ltr" role="region" aria-label={t("mapLabel")}>
      <MapContainer center={DUBAI_CENTER} zoom={11} scrollWheelZoom className="size-full" zoomControl>
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={TILE_MAX_ZOOM} />
        <FitBounds properties={properties} />
        <InvalidateOnResize />
        {properties.map((p) => (
          <PriceMarker key={p.id} property={p} currency={currency} active={p.id === activeId} onSelect={onSelect} />
        ))}
      </MapContainer>
    </div>
  );
}
