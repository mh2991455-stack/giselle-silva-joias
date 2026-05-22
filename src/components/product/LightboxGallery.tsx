"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";

interface LightboxGalleryProps {
  images: string[];
  alt: string;
}

export function LightboxGallery({ images, alt }: LightboxGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = images.map((src) => ({ src }));

  return (
    <>
      <div className="grid grid-cols-1 gap-3">
        {/* Main image */}
        <button
          onClick={() => { setIndex(0); setOpen(true); }}
          className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 cursor-zoom-in group"
          aria-label="Ampliar imagem"
        >
          <Image
            src={images[0]}
            alt={alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </button>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.slice(1, 5).map((src, i) => (
              <button
                key={src}
                onClick={() => { setIndex(i + 1); setOpen(true); }}
                className="relative aspect-square overflow-hidden rounded-xl bg-gray-50 cursor-zoom-in ring-2 ring-transparent hover:ring-[var(--color-primary)] transition-all duration-200"
                aria-label={`Ver imagem ${i + 2}`}
              >
                <Image
                  src={src}
                  alt={`${alt} ${i + 2}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Zoom, Thumbnails, Counter, Fullscreen]}
        zoom={{ maxZoomPixelRatio: 4, scrollToZoom: true }}
      />
    </>
  );
}
