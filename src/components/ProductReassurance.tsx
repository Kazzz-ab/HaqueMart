"use client";

import { Truck, RefreshCw, ShieldCheck } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale";
import { Price } from "@/components/Price";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/store-config";

/** Calm, premium reassurance block — replaces the old fake-urgency widget. */
export function ProductReassurance() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-4 text-sm">
      <div className="flex items-center gap-3">
        <Truck className="size-4 shrink-0 text-primary" strokeWidth={1.6} />
        <span className="flex flex-wrap items-center gap-1 text-muted-foreground">
          {t("announce.shippingPrefix")}
          <Price amount={FREE_SHIPPING_THRESHOLD} className="font-medium text-foreground" />
        </span>
      </div>
      <div className="flex items-center gap-3">
        <RefreshCw className="size-4 shrink-0 text-primary" strokeWidth={1.6} />
        <span className="text-muted-foreground">
          {t("trust.returnsTitle")} — {t("trust.returnsSub")}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <ShieldCheck className="size-4 shrink-0 text-primary" strokeWidth={1.6} />
        <span className="text-muted-foreground">
          {t("trust.paymentTitle")} — {t("trust.paymentSub")}
        </span>
      </div>
    </div>
  );
}
