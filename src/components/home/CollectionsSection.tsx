"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale";
import { COLLECTION_SHOWCASE } from "@/lib/mock-data";

export function CollectionsSection() {
  const { t } = useLocale();

  return (
    <section className="flex flex-col gap-8">
      <div data-reveal className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            {t("collections.eyebrow")}
          </p>
          <h2 className="font-heading mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("collections.title")}
          </h2>
          <p className="mt-2 max-w-md text-muted-foreground">{t("collections.subtitle")}</p>
        </div>
      </div>

      <div data-reveal-stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {COLLECTION_SHOWCASE.map((c) => (
          <Link
            key={c.slug}
            href={`/?category=${c.slug}`}
            className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-muted sm:aspect-[4/3]"
          >
            <Image
              src={c.image}
              alt={c.name}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-4">
              <span className="font-heading text-lg font-semibold text-white">{c.name}</span>
              <span className="flex size-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors group-hover:bg-primary">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
