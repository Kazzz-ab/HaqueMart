"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { Star, ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale";
import { HERO_IMAGE } from "@/lib/mock-data";

export function HeroSection() {
  const { t } = useLocale();
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = contentRef.current;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (el) {
      const items = el.querySelectorAll("[data-hero]");
      tl.from(items, { opacity: 0, y: 22, duration: 0.9, stagger: 0.12 });
    }
    if (imageRef.current) {
      tl.from(imageRef.current, { opacity: 0, scale: 1.04, duration: 1.1 }, 0.1);
    }
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="grid items-center gap-10 pt-6 lg:grid-cols-2 lg:gap-16 lg:pt-10">
      {/* Copy */}
      <div ref={contentRef} className="flex flex-col items-start">
        <span
          data-hero
          className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          {t("hero.eyebrow")}
        </span>

        <h1
          data-hero
          className="font-heading mt-6 text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl"
        >
          {t("hero.titleLine1")}
          <br />
          <span className="text-primary italic">{t("hero.titleLine2")}</span>
        </h1>

        <p data-hero className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t("hero.subtitle")}
        </p>

        <div data-hero className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="#products"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-8 text-[0.95rem] font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-md"
          >
            {t("hero.ctaPrimary")}
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="#story"
            className="inline-flex h-12 items-center rounded-full border border-border px-7 text-[0.95rem] font-medium transition-colors hover:bg-accent"
          >
            {t("hero.ctaSecondary")}
          </Link>
        </div>

        <div data-hero className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-4 fill-primary text-primary" />
            ))}
          </div>
          <span>
            <strong className="font-semibold text-foreground">4.8</strong> from 2,000+ reviews worldwide
          </span>
        </div>
      </div>

      {/* Image */}
      <div
        ref={imageRef}
        className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-border bg-muted shadow-sm sm:aspect-[5/4] lg:aspect-[4/5]"
      >
        <Image
          src={HERO_IMAGE}
          alt="A curated, considered living space"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        {/* Floating trust card */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/85 px-4 py-3 backdrop-blur-md sm:left-auto sm:right-5 sm:w-auto sm:max-w-[15rem]">
          <div>
            <p className="text-sm font-semibold">{t("trust.shippingTitle")}</p>
            <p className="text-xs text-muted-foreground">{t("trust.shippingSub")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
