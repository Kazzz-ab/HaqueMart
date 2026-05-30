"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart/context";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { cart, openCart } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">
            Haque<span className="text-primary">Mart</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Shop All
          </Link>
        </nav>

        {/* Cart */}
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Open cart — ${cart.itemCount} item${cart.itemCount !== 1 ? "s" : ""}`}
          onClick={openCart}
          className="relative"
        >
          <ShoppingCart className="size-5" />
          {cart.itemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {cart.itemCount > 9 ? "9+" : cart.itemCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
