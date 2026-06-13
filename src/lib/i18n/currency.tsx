"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CURRENCIES, DEFAULT_CURRENCY, type CurrencyCode } from "./regions";

const CURRENCY_KEY = "haquemart_currency";

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  /** Convert a base-USD amount into the active currency (numeric). */
  convert: (usd: number) => number;
  /** Convert + format a base-USD amount as a localized currency string. */
  format: (usd: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY);

  // Hydrate saved currency after mount (SSR-safe, no hydration mismatch).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CURRENCY_KEY);
      if (stored && stored in CURRENCIES) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage
        setCurrencyState(stored as CurrencyCode);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(CURRENCY_KEY, c);
    } catch {
      /* ignore */
    }
  }, []);

  const { convert, format } = useMemo(() => {
    const meta = CURRENCIES[currency];
    const formatter = new Intl.NumberFormat(meta.locale, {
      style: "currency",
      currency: meta.code,
    });
    return {
      convert: (usd: number) => usd * meta.rate,
      format: (usd: number) => formatter.format(usd * meta.rate),
    };
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
