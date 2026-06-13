"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale";
import { useCurrency } from "@/lib/i18n/currency";
import {
  LANGUAGES,
  CURRENCIES,
  REGIONS,
  type CurrencyCode,
  type LanguageCode,
} from "@/lib/i18n/regions";

const fieldClass =
  "w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground";

export function LocaleSwitcher({ align = "right" }: { align?: "left" | "right" }) {
  const { language, setLanguage } = useLocale();
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onEsc);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  // Derive the region whose defaults match the current language + currency.
  const activeRegion =
    REGIONS.find((r) => r.language === language && r.currency === currency)?.code ?? "";

  function applyRegion(code: string) {
    const region = REGIONS.find((r) => r.code === code);
    if (!region) return;
    setLanguage(region.language);
    setCurrency(region.currency);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Region, language and currency"
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <Globe className="size-[1.05rem]" />
        <span className="hidden font-medium md:inline">
          {currency} · {language.toUpperCase()}
        </span>
        <ChevronDown className="size-3.5 opacity-60" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose region, language and currency"
          className={`absolute z-50 mt-2 w-64 rounded-xl border border-border bg-popover p-4 shadow-xl ${
            align === "right" ? "end-0" : "start-0"
          }`}
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Region</label>
              <select
                className={fieldClass}
                value={activeRegion}
                onChange={(e) => applyRegion(e.target.value)}
              >
                {activeRegion === "" && <option value="">Custom</option>}
                {REGIONS.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Language</label>
              <select
                className={fieldClass}
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              >
                {Object.values(LANGUAGES).map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Currency</label>
              <select
                className={fieldClass}
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
