"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale";
import { Price } from "@/components/Price";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/store-config";

export function AnnouncementBar() {
  const { t } = useLocale();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative flex items-center justify-center bg-foreground px-10 py-2 text-center text-xs font-medium text-background sm:text-[0.8rem]">
      <p className="inline-flex flex-wrap items-center justify-center gap-1">
        {t("announce.shippingPrefix")}
        <Price amount={FREE_SHIPPING_THRESHOLD} className="font-semibold" />
        {t("announce.shippingSuffix")}
      </p>
      <button
        aria-label="Dismiss announcement"
        onClick={() => setDismissed(true)}
        className="absolute right-3 p-1 opacity-60 transition-opacity hover:opacity-100"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
