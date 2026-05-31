"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/QuantitySelector";
import { useCart } from "@/lib/cart/context";
import type { CartItem } from "@/types";

interface Props {
  item: Omit<CartItem, "quantity">;
  disabled?: boolean;
}

export function ProductActions({ item, disabled }: Props) {
  const { addItem, openCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ ...item, quantity: qty });
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="flex items-center gap-3">
      <QuantitySelector value={qty} onChange={setQty} min={1} max={10} />
      <Button
        size="lg"
        disabled={disabled || added}
        onClick={handleAdd}
        className="flex-1 gap-2 transition-all"
      >
        {added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
        {added ? "Added to cart!" : "Add to Cart"}
      </Button>
    </div>
  );
}
