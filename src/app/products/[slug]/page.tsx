import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { isWpConfigured } from "@/lib/graphql/client";
import { getProduct } from "@/lib/graphql/products";
import { MOCK_PRODUCT_MAP } from "@/lib/mock-data";
import { parsePrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/AddToCartButton";
import type { Product } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  let product: Product | null = null;

  if (isWpConfigured()) {
    try {
      product = await getProduct(slug);
    } catch {
      product = MOCK_PRODUCT_MAP[slug] ?? null;
    }
  } else {
    product = MOCK_PRODUCT_MAP[slug] ?? null;
  }

  if (!product) notFound();

  const isOnSale =
    product.salePrice !== null && product.salePrice !== product.regularPrice;
  const isOutOfStock = product.stockStatus === "OUT_OF_STOCK";
  const displayPrice = product.price ?? product.regularPrice ?? "£0";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="size-4" />
        Back to shop
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
          {product.image ? (
            <Image
              src={product.image.sourceUrl}
              alt={product.image.altText || product.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image available
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          {product.productCategories.nodes[0] && (
            <span className="text-sm font-medium uppercase tracking-wider text-primary">
              {product.productCategories.nodes[0].name}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className={`text-2xl font-bold ${isOnSale ? "text-primary" : ""}`}>
              {displayPrice}
            </span>
            {isOnSale && product.regularPrice && (
              <span className="text-base text-muted-foreground line-through">
                {product.regularPrice}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`size-2 rounded-full ${
                isOutOfStock ? "bg-destructive" : "bg-green-500"
              }`}
            />
            <span className={isOutOfStock ? "text-destructive" : "text-green-700"}>
              {isOutOfStock ? "Out of stock" : "In stock"}
            </span>
          </div>

          {/* Short description */}
          {product.shortDescription && (
            <p
              className="text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.shortDescription }}
            />
          )}

          {/* Add to cart */}
          <AddToCartButton
            item={{
              productId: product.databaseId,
              name: product.name,
              slug: product.slug,
              price: parsePrice(product.price ?? product.regularPrice),
              priceFormatted: displayPrice,
              image: product.image,
            }}
            disabled={isOutOfStock}
            size="lg"
          />

          {/* Full description */}
          {product.description && (
            <div className="mt-4 border-t border-border pt-6">
              <h2 className="mb-3 font-semibold">Product details</h2>
              <div
                className="prose prose-sm text-muted-foreground max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
