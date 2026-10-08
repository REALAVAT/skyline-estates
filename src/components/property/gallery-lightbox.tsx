"use client";

import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import imageLoader from "@/lib/image-loader";

interface GalleryLightboxProps {
  images: string[];
  alt: (index: number) => string;
  index: number;
  open: boolean;
  labels: { previous: string; next: string; close: string };
  onClose: () => void;
}

const widths = [828, 1200, 1920];

export default function GalleryLightbox({ images, alt, index, open, labels, onClose }: GalleryLightboxProps) {
  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      plugins={[Counter]}
      labels={{ Previous: labels.previous, Next: labels.next, Close: labels.close }}
      controller={{ closeOnBackdropClick: true }}
      carousel={{ finite: false }}
      styles={{ container: { backgroundColor: "rgba(7, 18, 36, 0.96)" } }}
      slides={images.map((src, i) => ({
        src: imageLoader({ src, width: 1920, quality: 75 }),
        alt: alt(i),
        width: 1920,
        height: 1280,
        srcSet: widths.map((w) => ({ src: imageLoader({ src, width: w, quality: 75 }), width: w, height: Math.round((w * 2) / 3) })),
      }))}
    />
  );
}
