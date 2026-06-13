"use client";

import { Truck, ShieldCheck, RefreshCw, Globe } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale";

export function FeatureStrip() {
  const { t } = useLocale();

  const features = [
    { icon: Truck, title: t("trust.shippingTitle"), sub: t("trust.shippingSub") },
    { icon: ShieldCheck, title: t("trust.paymentTitle"), sub: t("trust.paymentSub") },
    { icon: RefreshCw, title: t("trust.returnsTitle"), sub: t("trust.returnsSub") },
    { icon: Globe, title: t("trust.currencyTitle"), sub: t("trust.currencySub") },
  ];

  return (
    <section
      data-reveal
      className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4"
    >
      {features.map(({ icon: Icon, title, sub }) => (
        <div key={title} className="flex items-center gap-3 bg-card px-5 py-5">
          <Icon className="size-5 shrink-0 text-primary" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-semibold leading-tight">{title}</p>
            <p className="text-xs text-muted-foreground">{sub}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
