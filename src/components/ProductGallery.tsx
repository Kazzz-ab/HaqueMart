"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { WPImage } from "@/types";

interface Props {
  images: WPImage[];
  name: string;
  dimmed?: boolean;
}

export function ProductGallery({ images, name, dimmed }: Props) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-muted sm:aspect-square">
        {main ? (
          <Image
            src={main.sourceUrl}
            alt={main.altText || name}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={cn("object-cover", dimmed && "opacity-70 grayscale")}
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image available
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border bg-muted transition-colors",
                i === active ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40",
              )}
            >
              <Image
                src={img.sourceUrl}
                alt={img.altText || `${name} ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
