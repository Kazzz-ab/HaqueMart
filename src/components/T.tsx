"use client";

import { useLocale } from "@/lib/i18n/locale";

/**
 * Tiny translation island — lets server components render a localized string
 * without becoming client components themselves. Usage: <T k="pdp.details" />
 */
export function T({ k }: { k: string }) {
  const { t } = useLocale();
  return <>{t(k)}</>;
}
