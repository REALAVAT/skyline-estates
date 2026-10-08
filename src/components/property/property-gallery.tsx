"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Expand } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const GalleryLightbox = dynamic(() => import("./gallery-lightbox"), { ssr: false });

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const t = useTranslations("property");
  const tc = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [requested, setRequested] = useState(false);

  const show = (i: number) => {
    setIndex(i);
    setRequested(true);
    setOpen(true);
  };

  const alt = (i: number) => tc("photoAlt", { title, index: i + 1 });
  const tiles = images.slice(0, 5);

  return (
    <section aria-label={t("gallery")} className="relative">
      <div className="grid h-[300px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl sm:h-[420px] lg:h-[540px]">
        {tiles.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => show(i)}
            aria-label={`${t("gallery")}: ${alt(i)}`}
            className={cn(
              "group relative overflow-hidden bg-sand focus-visible:z-10",
              i === 0 ? "col-span-4 row-span-2 md:col-span-2" : "hidden md:block",
            )}
          >
            <Image
              src={src}
              alt={alt(i)}
              fill
              priority={i === 0}
              quality={i === 0 ? 60 : 55}
              sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "25vw"}
              className="object-cover transform-gpu transition-transform duration-700 ease-luxe group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-navy/0 transition-colors duration-500 group-hover:bg-navy/10" />
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => show(0)}
        className="absolute end-4 bottom-4 inline-flex h-11 items-center gap-2 rounded-full bg-white/95 px-5 text-sm font-semibold text-navy shadow-soft backdrop-blur transition-colors hover:bg-white"
      >
        <Expand className="size-4" aria-hidden="true" />
        {t("viewAllPhotos", { count: images.length })}
      </button>
      {requested && (
        <GalleryLightbox
          images={images}
          alt={alt}
          index={index}
          open={open}
          labels={{ previous: tc("previousImage"), next: tc("nextImage"), close: tc("close") }}
          onClose={() => setOpen(false)}
        />
      )}
    </section>
  );
}
