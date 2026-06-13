// ── i18n primitives: languages, currencies, regions ──────────────────────────
// Base currency for all stored product amounts is USD. Exchange rates are a
// static demo table (units per 1 USD). In production these would come from a
// live FX feed; the shape stays identical.

export type LanguageCode = "en" | "es" | "fr" | "ar";
export type CurrencyCode =
  | "USD" | "EUR" | "GBP" | "JPY" | "INR" | "AED" | "AUD" | "CAD";

export interface LanguageMeta {
  code: LanguageCode;
  /** Native name, shown in the switcher */
  label: string;
  dir: "ltr" | "rtl";
}

export interface CurrencyMeta {
  code: CurrencyCode;
  /** Locale used by Intl.NumberFormat for grouping & symbol placement */
  locale: string;
  /** Units of this currency per 1 USD (demo static rate) */
  rate: number;
}

export interface RegionMeta {
  code: string;
  label: string;
  language: LanguageCode;
  currency: CurrencyCode;
}

export const LANGUAGES: Record<LanguageCode, LanguageMeta> = {
  en: { code: "en", label: "English",  dir: "ltr" },
  es: { code: "es", label: "Español",  dir: "ltr" },
  fr: { code: "fr", label: "Français", dir: "ltr" },
  ar: { code: "ar", label: "العربية",  dir: "rtl" },
};

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  USD: { code: "USD", locale: "en-US", rate: 1 },
  EUR: { code: "EUR", locale: "de-DE", rate: 0.92 },
  GBP: { code: "GBP", locale: "en-GB", rate: 0.79 },
  JPY: { code: "JPY", locale: "ja-JP", rate: 157 },
  INR: { code: "INR", locale: "en-IN", rate: 83.2 },
  AED: { code: "AED", locale: "ar-AE", rate: 3.67 },
  AUD: { code: "AUD", locale: "en-AU", rate: 1.51 },
  CAD: { code: "CAD", locale: "en-CA", rate: 1.37 },
};

/** Region → default language + currency. Selecting a region preselects both. */
export const REGIONS: RegionMeta[] = [
  { code: "US", label: "United States",        language: "en", currency: "USD" },
  { code: "GB", label: "United Kingdom",       language: "en", currency: "GBP" },
  { code: "FR", label: "France",               language: "fr", currency: "EUR" },
  { code: "ES", label: "Spain",                language: "es", currency: "EUR" },
  { code: "AE", label: "United Arab Emirates", language: "ar", currency: "AED" },
  { code: "IN", label: "India",                language: "en", currency: "INR" },
  { code: "JP", label: "Japan",                language: "en", currency: "JPY" },
  { code: "AU", label: "Australia",            language: "en", currency: "AUD" },
  { code: "CA", label: "Canada",               language: "en", currency: "CAD" },
];

export const DEFAULT_LANGUAGE: LanguageCode = "en";
export const DEFAULT_CURRENCY: CurrencyCode = "USD";
export const DEFAULT_REGION = "US";

/** Full country list for checkout shipping (superset of storefront regions). */
export const COUNTRIES: string[] = [
  "United States", "United Kingdom", "Canada", "Australia", "Ireland",
  "France", "Germany", "Spain", "Italy", "Netherlands", "Belgium",
  "Switzerland", "Sweden", "Norway", "Denmark", "Portugal", "Austria",
  "United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait",
  "India", "Singapore", "Malaysia", "Japan", "South Korea",
  "New Zealand", "Brazil", "Mexico", "South Africa",
];
