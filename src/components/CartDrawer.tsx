"use client";

import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart/context";
import { useLocale } from "@/lib/i18n/locale";
import { Price } from "@/components/Price";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/QuantitySelector";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/store-config";

export function CartDrawer() {
  const { cart, isOpen, closeCart, removeItem, updateQuantity } = useCart();
  const { t } = useLocale();

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cart.total);
  const shippingProgress = Math.min(100, (cart.total / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("cart.title")}
        className={`fixed end-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-heading text-lg font-semibold">
            {t("cart.title")}
            {cart.itemCount > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({cart.itemCount} {cart.itemCount !== 1 ? t("cart.items") : t("cart.item")})
              </span>
            )}
          </h2>
          <Button variant="ghost" size="icon" onClick={closeCart} aria-label="Close cart">
            <X />
          </Button>
        </div>

        {/* Free shipping progress */}
        {cart.items.length > 0 && (
          <div className="border-b border-border bg-secondary/40 px-5 py-3">
            {remaining > 0 ? (
              <p className="mb-2 text-center text-xs text-muted-foreground">
                {t("cart.awayPrefix")}
                <Price amount={remaining} className="font-semibold text-foreground" />
                {t("cart.awaySuffix")}
              </p>
            ) : (
              <p className="mb-2 text-center text-xs font-semibold text-primary">
                {t("cart.unlocked")}
              </p>
            )}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
              <ShoppingBag className="size-12 opacity-20" />
              <p className="font-medium text-foreground">{t("cart.empty")}</p>
              <p className="text-sm">{t("cart.emptySub")}</p>
              <Button variant="outline" size="sm" onClick={closeCart}>
                {t("cart.continue")}
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {cart.items.map((item) => (
                <li key={item.productId} className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {item.image ? (
                      <Image
                        src={item.image.sourceUrl}
                        alt={item.image.altText || item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        —
                      </div>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Link
                      href={`/products/${item.slug}`}
                      className="truncate text-sm font-medium hover:text-primary"
                      onClick={closeCart}
                    >
                      {item.name}
                    </Link>
                    <Price
                      amount={item.price * item.quantity}
                      className="text-sm font-semibold text-primary"
                    />
                    <div className="mt-1 flex items-center justify-between">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(q) => updateQuantity(item.productId, q)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeItem(item.productId)}
                        className="size-7 text-muted-foreground hover:text-destructive"
                      >
                        <X />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-border px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("cart.subtotal")}</span>
              <Price amount={cart.total} className="font-semibold" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("cart.shipping")}</span>
              <span className={remaining > 0 ? "text-muted-foreground" : "font-semibold text-primary"}>
                {remaining > 0 ? t("cart.shippingCalc") : t("cart.shippingFree")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{t("cart.taxesNote")}</p>
            <Link href="/checkout" onClick={closeCart}>
              <Button className="w-full" size="lg">
                {t("cart.checkout")}
              </Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={closeCart}>
              {t("cart.continue")}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
