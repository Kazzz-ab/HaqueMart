"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/context";
import { useLocale } from "@/lib/i18n/locale";
import type { CartItem } from "@/types";

interface Props {
  item: Omit<CartItem, "quantity">;
  disabled?: boolean;
  size?: "default" | "sm" | "lg";
  /** Compact circular icon button (used on product cards). */
  iconOnly?: boolean;
}

export function AddToCartButton({ item, disabled, size = "default", iconOnly }: Props) {
  const { addItem, openCart } = useCart();
  const { t } = useLocale();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({ ...item, quantity: 1 });
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (iconOnly) {
    return (
      <Button
        size="icon"
        disabled={disabled || added}
        onClick={handleClick}
        aria-label={t("pdp.addToCart")}
        className="size-10"
      >
        {added ? <Check /> : <ShoppingBag />}
      </Button>
    );
  }

  return (
    <Button size={size} disabled={disabled || added} onClick={handleClick} className="gap-2">
      {added ? <Check /> : <ShoppingBag />}
      {added ? t("pdp.added") : t("pdp.addToCart")}
    </Button>
  );
}
