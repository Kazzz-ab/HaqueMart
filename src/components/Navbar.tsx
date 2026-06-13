"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, X, Heart, User, Menu, ChevronDown } from "lucide-react";
import { useCart } from "@/lib/cart/context";
import { useWishlist } from "@/lib/wishlist/context";
import { useLocale } from "@/lib/i18n/locale";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { COLLECTION_SHOWCASE } from "@/lib/mock-data";

export function Navbar() {
  const { cart, openCart } = useCart();
  const { ids } = useWishlist();
  const { t } = useLocale();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount guard avoids cart/wishlist count hydration mismatch
    setMounted(true);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/?q=${encodeURIComponent(query)}` : "/");
    setSearchOpen(false);
    setMenuOpen(false);
  }

  const wishCount = mounted ? ids.size : 0;
  const cartCount = mounted ? cart.itemCount : 0;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-5 px-4 sm:px-6">
        {/* Mobile menu toggle */}
        <button
          aria-label="Menu"
          onClick={() => setMenuOpen((o) => !o)}
          className="-ml-1 rounded-full p-2 text-foreground transition-colors hover:bg-accent lg:hidden"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span className="font-heading text-xl font-semibold tracking-tight">
            Haque<span className="text-primary">Mart</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/"
            className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
          >
            {t("nav.shopAll")}
          </Link>

          {/* Collections mega-menu */}
          <div className="group relative">
            <button className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground">
              {t("nav.collections")}
              <ChevronDown className="size-3.5 opacity-60 transition-transform group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-0 top-full pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="grid w-[34rem] grid-cols-3 gap-3 rounded-2xl border border-border bg-popover p-4 shadow-xl">
                {COLLECTION_SHOWCASE.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/?category=${c.slug}`}
                    className="group/tile overflow-hidden rounded-xl border border-border/60 transition-colors hover:border-primary/40"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <Image
                        src={c.image}
                        alt={c.name}
                        fill
                        sizes="180px"
                        className="object-cover transition-transform duration-500 group-hover/tile:scale-105"
                      />
                    </div>
                    <span className="block px-3 py-2 text-sm font-medium">{c.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/#story"
            className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
          >
            {t("nav.story")}
          </Link>
        </nav>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="relative ml-auto hidden max-w-xs flex-1 md:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("nav.searchPlaceholder")}
            className="w-full rounded-full border border-border bg-secondary/60 py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground transition-colors focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-0.5 md:ml-0">
          <div className="hidden sm:block">
            <LocaleSwitcher />
          </div>

          <button
            aria-label={searchOpen ? "Close search" : "Search"}
            onClick={() => setSearchOpen((o) => !o)}
            className="rounded-full p-2.5 text-foreground transition-colors hover:bg-accent md:hidden"
          >
            {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
          </button>

          <Link
            href="#"
            aria-label={t("nav.account")}
            className="hidden rounded-full p-2.5 text-foreground transition-colors hover:bg-accent sm:inline-flex"
          >
            <User className="size-5" strokeWidth={1.6} />
          </Link>

          <Link
            href="#"
            aria-label={t("nav.wishlist")}
            className="relative rounded-full p-2.5 text-foreground transition-colors hover:bg-accent"
          >
            <Heart className="size-5" strokeWidth={1.6} />
            {wishCount > 0 && (
              <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {wishCount > 9 ? "9+" : wishCount}
              </span>
            )}
          </Link>

          <button
            aria-label={`${t("nav.cart")} — ${cartCount}`}
            onClick={openCart}
            className="relative rounded-full p-2.5 text-foreground transition-colors hover:bg-accent"
          >
            <ShoppingBag className="size-5" strokeWidth={1.6} />
            {cartCount > 0 && (
              <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search row */}
      {searchOpen && (
        <div className="border-t border-border px-4 py-3 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("nav.searchPlaceholder")}
              className="w-full rounded-full border border-border bg-secondary/60 py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            <Link href="/" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent">
              {t("nav.shopAll")}
            </Link>
            <Link href="/#story" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent">
              {t("nav.story")}
            </Link>
            <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("nav.collections")}
            </p>
            <div className="grid grid-cols-2 gap-1">
              {COLLECTION_SHOWCASE.map((c) => (
                <Link
                  key={c.slug}
                  href={`/?category=${c.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm hover:bg-accent"
                >
                  {c.name}
                </Link>
              ))}
            </div>
            <div className="mt-3 border-t border-border pt-3">
              <LocaleSwitcher align="left" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
