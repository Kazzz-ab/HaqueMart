"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Loader2, Package, Lock } from "lucide-react";
import { useCart } from "@/lib/cart/context";
import { useLocale } from "@/lib/i18n/locale";
import { Price } from "@/components/Price";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/lib/i18n/regions";
import { PAYMENT_METHODS } from "@/lib/store-config";

function generateOrderId() {
  return "HM-" + Math.random().toString(36).slice(2, 10).toUpperCase();
}

const inputClass =
  "w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
const labelClass = "mb-1.5 block text-sm font-medium";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { t } = useLocale();

  const [mounted, setMounted] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    region: "",
    postcode: "",
    country: "United States",
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount guard avoids cart hydration mismatch
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && cart.items.length === 0 && !placing) {
      router.replace("/");
    }
  }, [mounted, cart.items.length, placing, router]);

  function set<K extends keyof typeof form>(field: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPlacing(true);
    await new Promise((res) => setTimeout(res, 1600));
    const orderId = generateOrderId();
    clearCart();
    router.push(`/checkout/success?order=${orderId}`);
  }

  if (!mounted) return null;
  if (cart.items.length === 0 && !placing) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        {t("checkout.back")}
      </Link>

      <h1 className="font-heading mb-8 text-3xl font-semibold">{t("checkout.title")}</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        {/* Left — form */}
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="mb-4 text-base font-semibold">{t("checkout.contact")}</h2>
            <div>
              <label className={labelClass}>{t("checkout.email")}</label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
                className={inputClass}
              />
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-base font-semibold">{t("checkout.shippingAddress")}</h2>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t("checkout.firstName")}</label>
                  <input type="text" required autoComplete="given-name" placeholder="Alex" value={form.firstName} onChange={set("firstName")} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t("checkout.lastName")}</label>
                  <input type="text" required autoComplete="family-name" placeholder="Taylor" value={form.lastName} onChange={set("lastName")} className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>{t("checkout.address1")}</label>
                <input type="text" required autoComplete="address-line1" placeholder="123 Market Street" value={form.address1} onChange={set("address1")} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>
                  {t("checkout.address2")}{" "}
                  <span className="font-normal text-muted-foreground">({t("checkout.optional")})</span>
                </label>
                <input type="text" autoComplete="address-line2" placeholder="Apt 4B" value={form.address2} onChange={set("address2")} className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t("checkout.city")}</label>
                  <input type="text" required autoComplete="address-level2" value={form.city} onChange={set("city")} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t("checkout.region")}</label>
                  <input type="text" autoComplete="address-level1" value={form.region} onChange={set("region")} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t("checkout.postcode")}</label>
                  <input type="text" required autoComplete="postal-code" value={form.postcode} onChange={set("postcode")} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t("checkout.country")}</label>
                  <select value={form.country} onChange={set("country")} className={inputClass}>
                    {COUNTRIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Payment (demo) */}
          <section>
            <h2 className="mb-4 text-base font-semibold">{t("checkout.payment")}</h2>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((m, i) => (
                <span
                  key={m}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                    i === 0 ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground"
                  }`}
                >
                  {m}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{t("checkout.paymentNote")}</p>
          </section>
        </div>

        {/* Right — summary */}
        <aside className="flex h-fit flex-col gap-4 rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="font-semibold">{t("checkout.summary")}</h2>

          <ul className="flex flex-col divide-y divide-border">
            {cart.items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {item.image ? (
                    <Image src={item.image.sourceUrl} alt={item.image.altText || item.name} fill sizes="56px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="size-5 text-muted-foreground" />
                    </div>
                  )}
                  <span className="absolute -end-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="line-clamp-2 text-sm font-medium leading-snug">{item.name}</span>
                </div>
                <Price amount={item.price * item.quantity} className="shrink-0 text-sm font-semibold" />
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("checkout.subtotal")}</span>
              <Price amount={cart.total} className="font-medium" />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("checkout.shipping")}</span>
              <span className="text-muted-foreground">{t("checkout.shippingCalc")}</span>
            </div>
          </div>

          <div className="flex justify-between border-t border-border pt-3 font-semibold">
            <span>{t("checkout.total")}</span>
            <Price amount={cart.total} />
          </div>

          <Button type="submit" size="lg" className="mt-1 w-full gap-2" disabled={placing}>
            {placing ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
            {placing ? t("checkout.placing") : t("checkout.placeOrder")}
          </Button>

          <p className="text-center text-xs text-muted-foreground">{t("checkout.demoNote")}</p>
        </aside>
      </form>
    </div>
  );
}
