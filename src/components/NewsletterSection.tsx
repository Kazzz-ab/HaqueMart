"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale";

export function NewsletterSection() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <section
      data-reveal
      className="overflow-hidden rounded-3xl bg-foreground px-6 py-14 text-background sm:px-12 sm:py-16"
    >
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("newsletter.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-background/70">{t("newsletter.subtitle")}</p>

        {submitted ? (
          <div className="mx-auto mt-8 flex max-w-sm items-center justify-center gap-2 rounded-full bg-background/10 py-3.5 font-medium">
            <Check className="size-5" />
            {t("newsletter.success")}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.placeholder")}
              className="min-w-0 flex-1 rounded-full border border-background/20 bg-background/10 px-5 py-3 text-sm text-background placeholder:text-background/50 focus:border-background/40 focus:outline-none focus:ring-2 focus:ring-background/20"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
            >
              {t("newsletter.button")}
              <ArrowRight className="size-4" />
            </button>
          </form>
        )}

        <p className="mt-4 text-xs text-background/50">{t("newsletter.disclaimer")}</p>
      </div>
    </section>
  );
}
