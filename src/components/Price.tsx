"use client";

import { useCurrency } from "@/lib/i18n/currency";

interface Props {
  /** Amount in the base currency (USD). Converted + formatted to the active currency. */
  amount: number | null | undefined;
  className?: string;
}

/** Single source of truth for rendering a price in the shopper's currency. */
export function Price({ amount, className }: Props) {
  const { format } = useCurrency();
  if (amount == null) return <span className={className}>—</span>;
  return <span className={className}>{format(amount)}</span>;
}
