"use client";

import { Star, Quote } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale";

const TESTIMONIALS = [
  {
    quote:
      "Everything about the experience felt considered — from the packaging to the shipping updates. Prices showed in euros from the first click.",
    author: "Camille D.",
    location: "Lyon, France",
  },
  {
    quote:
      "Genuinely premium quality at a fair price, and it arrived faster than expected. The kind of shop you tell friends about.",
    author: "Marcus J.",
    location: "Toronto, Canada",
  },
  {
    quote:
      "Seeing the total in dirhams before checkout made all the difference. No surprises, no guesswork — I'll order again.",
    author: "Layla H.",
    location: "Dubai, UAE",
  },
];

export function Testimonials() {
  const { t } = useLocale();

  return (
    <section className="flex flex-col gap-8">
      <div data-reveal className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          {t("testimonials.eyebrow")}
        </p>
        <h2 className="font-heading mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("testimonials.title")}
        </h2>
      </div>

      <div data-reveal-stagger className="grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((tst) => (
          <figure
            key={tst.author}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
          >
            <Quote className="size-6 text-primary/40" />
            <blockquote className="flex-1 text-sm leading-relaxed text-foreground/90">
              “{tst.quote}”
            </blockquote>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <figcaption>
                <p className="text-sm font-semibold">{tst.author}</p>
                <p className="text-xs text-muted-foreground">{tst.location}</p>
              </figcaption>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-primary text-primary" />
                ))}
              </div>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
