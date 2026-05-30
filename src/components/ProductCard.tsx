import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { parsePrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/AddToCartButton";
import type { ProductListItem } from "@/types";

interface Props {
  product: ProductListItem;
}

export function ProductCard({ product }: Props) {
  const isOnSale =
    product.salePrice !== null &&
    product.salePrice !== product.regularPrice;

  const isOutOfStock = product.stockStatus === "OUT_OF_STOCK";

  return (
    <div className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/3] overflow-hidden bg-muted">
        {product.image ? (
          <Image
            src={product.image.sourceUrl}
            alt={product.image.altText || product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className={cn(
              "object-cover transition-transform duration-300 group-hover:scale-105",
              isOutOfStock && "opacity-50 grayscale",
            )}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
            No image
          </div>
        )}
        {isOnSale && !isOutOfStock && (
          <span className="absolute top-2 left-2 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
            Sale
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute top-2 left-2 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            Sold out
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {product.productCategories.nodes[0] && (
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {product.productCategories.nodes[0].name}
          </span>
        )}
        <Link
          href={`/products/${product.slug}`}
          className="font-semibold leading-snug hover:text-primary transition-colors line-clamp-2"
        >
          {product.name}
        </Link>
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className={cn("font-bold", isOnSale && "text-primary")}>
              {product.price ?? product.regularPrice ?? "—"}
            </span>
            {isOnSale && product.regularPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {product.regularPrice}
              </span>
            )}
          </div>
          <AddToCartButton
            item={{
              productId: product.databaseId,
              name: product.name,
              slug: product.slug,
              price: parsePrice(product.price ?? product.regularPrice),
              priceFormatted: product.price ?? product.regularPrice ?? "£0",
              image: product.image,
            }}
            disabled={isOutOfStock}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
