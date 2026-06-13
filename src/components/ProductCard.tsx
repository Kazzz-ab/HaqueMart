"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Price } from "@/components/Price";
import { useWishlist } from "@/lib/wishlist/context";
import { useLocale } from "@/lib/i18n/locale";
import type { ProductListItem } from "@/types";

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "size-3",
              i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted",
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {rating.toFixed(1)} ({count})
      </span>
    </div>
  );
}

interface Props {
  product: ProductListItem;
}

export function ProductCard({ product }: Props) {
  const { has, toggle } = useWishlist();
  const { t } = useLocale();
  const wishlisted = has(product.id);

  const isOnSale =
    product.salePriceAmount != null && product.salePriceAmount !== product.regularPriceAmount;
  const isOutOfStock = product.stockStatus === "OUT_OF_STOCK";
  const isLowStock =
    !isOutOfStock && product.stockCount !== undefined && product.stockCount <= 5;
  const current = product.priceAmount ?? product.regularPriceAmount ?? 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-muted"
      >
        {product.image ? (
          <Image
            src={product.image.sourceUrl}
            alt={product.image.altText || product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className={cn(
              "object-cover transition-transform duration-700 group-hover:scale-105",
              isOutOfStock && "opacity-60 grayscale",
            )}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {isOutOfStock ? (
            <span className="rounded-full bg-background/90 px-2.5 py-0.5 text-[0.7rem] font-semibold text-muted-foreground shadow-sm backdrop-blur">
              {t("pdp.outOfStock")}
            </span>
          ) : isOnSale ? (
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-[0.7rem] font-semibold text-primary-foreground shadow-sm">
              {t("pdp.sale")}
            </span>
          ) : null}

          {product.badge === "best-seller" && !isOutOfStock && (
            <span className="rounded-full bg-foreground/90 px-2.5 py-0.5 text-[0.7rem] font-semibold text-background shadow-sm backdrop-blur">
              Bestseller
            </span>
          )}
          {product.badge === "new" && !isOutOfStock && (
            <span className="rounded-full border border-border bg-card/90 px-2.5 py-0.5 text-[0.7rem] font-semibold shadow-sm backdrop-blur">
              New
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border border-border/60 bg-background/80 shadow-sm backdrop-blur transition-all duration-200 hover:scale-105 hover:border-primary/40 active:scale-95"
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              wishlisted ? "fill-destructive text-destructive" : "text-muted-foreground",
            )}
          />
        </button>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.productCategories.nodes[0] && (
          <span className="text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">
            {product.productCategories.nodes[0].name}
          </span>
        )}

        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 font-medium leading-snug transition-colors hover:text-primary"
        >
          {product.name}
        </Link>

        {product.rating && product.reviewCount ? (
          <StarRating rating={product.rating} count={product.reviewCount} />
        ) : null}

        {isLowStock && (
          <span className="text-xs text-muted-foreground">{t("pdp.lowStock")}</span>
        )}

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div className="flex items-baseline gap-2">
            <Price amount={current} className={cn("font-semibold", isOnSale && "text-primary")} />
            {isOnSale && product.regularPriceAmount != null && (
              <Price
                amount={product.regularPriceAmount}
                className="text-sm text-muted-foreground line-through"
              />
            )}
          </div>
          <AddToCartButton
            item={{
              productId: product.databaseId,
              name: product.name,
              slug: product.slug,
              price: current,
              image: product.image,
            }}
            disabled={isOutOfStock}
            size="sm"
            iconOnly
          />
        </div>
      </div>
    </div>
  );
}
