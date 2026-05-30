"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/context";
import type { CartItem } from "@/types";

interface Props {
  item: Omit<CartItem, "quantity">;
  disabled?: boolean;
  size?: "default" | "lg";
}

export function AddToCartButton({ item, disabled, size = "default" }: Props) {
  const { addItem, openCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({ ...item, quantity: 1 });
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Button
      size={size}
      disabled={disabled || added}
      onClick={handleClick}
      className="gap-2"
    >
      {added ? <Check /> : <ShoppingCart />}
      {added ? "Added!" : "Add to Cart"}
    </Button>
  );
}
