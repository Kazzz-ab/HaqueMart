"use client";

import Link from "next/link";
import { Truck, ShieldCheck, RefreshCw, Globe } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { Price } from "@/components/Price";
import { FREE_SHIPPING_THRESHOLD, PAYMENT_METHODS } from "@/lib/store-config";

export function Footer() {
  const { t } = useLocale();

  const trust = [
    { icon: Truck, title: t("trust.shippingTitle"), sub: t("trust.shippingSub") },
    { icon: ShieldCheck, title: t("trust.paymentTitle"), sub: t("trust.paymentSub") },
    { icon: RefreshCw, title: t("trust.returnsTitle"), sub: t("trust.returnsSub") },
    { icon: Globe, title: t("trust.currencyTitle"), sub: t("trust.currencySub") },
  ];

  const columns: { heading: string; links: { label: string; href: string }[] }[] = [
    {
      heading: t("footer.shop"),
      links: [
        { label: t("nav.shopAll"), href: "/" },
        { label: "Bags", href: "/?category=bags" },
        { label: "Kitchen", href: "/?category=kitchen" },
        { label: "Home Office", href: "/?category=home-office" },
        { label: "Clothing", href: "/?category=clothing" },
      ],
    },
    {
      heading: t("footer.help"),
      links: [
        { label: t("footer.faqs"), href: "#" },
        { label: t("footer.shippingInfo"), href: "#" },
        { label: t("footer.returns"), href: "#" },
        { label: t("footer.track"), href: "#" },
        { label: t("footer.contact"), href: "#" },
      ],
    },
    {
      heading: t("footer.company"),
      links: [
        { label: t("footer.about"), href: "#" },
        { label: t("footer.blog"), href: "#" },
        { label: t("footer.press"), href: "#" },
        { label: t("footer.careers"), href: "#" },
      ],
    },
  ];

  return (
    <footer className="mt-24 border-t border-border bg-card">
      {/* Trust strip */}
      <div className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:px-6">
          {trust.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold leading-tight">{title}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="font-heading text-xl font-semibold tracking-tight">
              Haque<span className="text-primary">Mart</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("footer.tagline")}
            </p>
            <div className="mt-5 flex gap-2.5">
              {["Instagram", "Pinterest", "LinkedIn"].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="flex size-9 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {columns.map(({ heading, links }) => (
            <div key={heading}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {heading}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-foreground/80 transition-colors hover:text-primary"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Region + payments */}
        <div className="mt-12 flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("footer.region")}
            </span>
            <div className="rounded-full border border-border">
              <LocaleSwitcher align="left" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {PAYMENT_METHODS.map((m) => (
              <span
                key={m}
                className="rounded-md border border-border px-2.5 py-1 text-[0.7rem] font-medium text-muted-foreground"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Free-shipping note + legal */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} HaqueMart. {t("footer.rights")}
            {" · "}
            <span className="inline-flex flex-wrap items-center gap-1">
              {t("announce.shippingPrefix")}
              <Price amount={FREE_SHIPPING_THRESHOLD} className="font-medium text-foreground" />
            </span>
          </p>
          <div className="flex gap-4">
            <a href="#" className="transition-colors hover:text-foreground">{t("footer.privacy")}</a>
            <a href="#" className="transition-colors hover:text-foreground">{t("footer.terms")}</a>
            <a href="#" className="transition-colors hover:text-foreground">{t("footer.cookies")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
