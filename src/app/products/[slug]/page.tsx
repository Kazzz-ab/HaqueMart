import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, Star, ShieldCheck, Truck, RefreshCw, BadgeCheck } from "lucide-react";
import { isWpConfigured } from "@/lib/graphql/client";
import { getProduct } from "@/lib/graphql/products";
import { MOCK_PRODUCT_MAP } from "@/lib/mock-data";
import { ProductActions } from "@/components/ProductActions";
import { ProductReassurance } from "@/components/ProductReassurance";
import { ProductGallery } from "@/components/ProductGallery";
import { Price } from "@/components/Price";
import { T } from "@/components/T";
import type { Product, MockReview, WPImage } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

async function resolveProduct(slug: string): Promise<Product | null> {
  if (isWpConfigured()) {
    try {
      return await getProduct(slug);
    } catch {
      return MOCK_PRODUCT_MAP[slug] ?? null;
    }
  }
  return MOCK_PRODUCT_MAP[slug] ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await resolveProduct(slug);

  if (!product) {
    return { title: "Product not found — HaqueMart" };
  }

  const description =
    product.shortDescription?.replace(/<[^>]+>/g, "").slice(0, 160) ??
    `Shop ${product.name} at HaqueMart`;

  return {
    title: `${product.name} — HaqueMart`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.image ? [{ url: product.image.sourceUrl, alt: product.image.altText }] : [],
    },
  };
}

function ReviewCard({ review }: { review: MockReview }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
            {review.author[0]}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold">{review.author}</span>
              {review.verified && (
                <span className="flex items-center gap-0.5 text-xs font-medium text-primary">
                  <BadgeCheck className="size-3.5" /> <T k="pdp.verified" />
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{review.date}</span>
          </div>
        </div>
        <div className="flex shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`size-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{review.body}</p>
    </div>
  );
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await resolveProduct(slug);
  if (!product) notFound();

  const isOnSale =
    product.salePriceAmount != null && product.salePriceAmount !== product.regularPriceAmount;
  const isOutOfStock = product.stockStatus === "OUT_OF_STOCK";
  const isLowStock =
    !isOutOfStock && product.stockCount !== undefined && product.stockCount <= 5;
  const current = product.priceAmount ?? product.regularPriceAmount ?? 0;
  const regular = product.regularPriceAmount;
  const savings = isOnSale && regular != null ? regular - current : 0;
  const category = product.productCategories.nodes[0];
  const avgRating = product.rating ?? 4.5;
  const reviewCount = product.reviewCount ?? 0;
  const reviews = product.reviews ?? [];

  const galleryImages: WPImage[] = product.galleryImages.nodes.length
    ? product.galleryImages.nodes
    : product.image
      ? [product.image]
      : [];

  const stockKey = isOutOfStock ? "pdp.outOfStock" : isLowStock ? "pdp.lowStock" : "pdp.inStock";
  const stockDot = isOutOfStock ? "bg-destructive" : isLowStock ? "bg-amber-500" : "bg-emerald-500";
  const stockColor = isOutOfStock
    ? "text-destructive"
    : isLowStock
      ? "text-amber-600"
      : "text-emerald-600";

  const trust = [
    { icon: ShieldCheck, title: "pdp.secureTitle", sub: "pdp.secureSub" },
    { icon: Truck, title: "pdp.dispatchTitle", sub: "pdp.dispatchSub" },
    { icon: RefreshCw, title: "pdp.returnsTitle", sub: "pdp.returnsSub" },
    { icon: BadgeCheck, title: "pdp.ratedTitle", sub: "pdp.ratedSub" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          <T k="pdp.home" />
        </Link>
        <ChevronRight className="size-3.5" />
        {category && (
          <>
            <Link href={`/?category=${category.slug}`} className="transition-colors hover:text-foreground">
              {category.name}
            </Link>
            <ChevronRight className="size-3.5" />
          </>
        )}
        <span className="truncate font-medium text-foreground">{product.name}</span>
      </nav>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={galleryImages} name={product.name} dimmed={isOutOfStock} />

        {/* Details */}
        <div className="flex flex-col gap-5">
          {category && (
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              {category.name}
            </span>
          )}
          <h1 className="font-heading text-3xl font-semibold leading-tight sm:text-4xl">
            {product.name}
          </h1>

          {reviewCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({reviewCount})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-3">
            <Price
              amount={current}
              className={`text-3xl font-semibold ${isOnSale ? "text-primary" : ""}`}
            />
            {isOnSale && regular != null && (
              <Price amount={regular} className="text-lg text-muted-foreground line-through" />
            )}
            {isOnSale && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <T k="pdp.save" /> <Price amount={savings} />
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 text-sm">
            <span className={`size-2.5 rounded-full ${stockDot}`} />
            <span className={`font-medium ${stockColor}`}>
              <T k={stockKey} />
            </span>
          </div>

          {product.shortDescription && (
            <p
              className="leading-relaxed text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: product.shortDescription }}
            />
          )}

          {/* Add to cart */}
          <ProductActions
            item={{
              productId: product.databaseId,
              name: product.name,
              slug: product.slug,
              price: current,
              image: product.image,
            }}
            disabled={isOutOfStock}
          />

          {/* Reassurance */}
          <ProductReassurance />

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-secondary/30 p-4">
            {trust.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-2.5">
                <Icon className="size-4 shrink-0 text-primary" strokeWidth={1.6} />
                <div>
                  <p className="text-xs font-semibold">
                    <T k={title} />
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <T k={sub} />
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Full description */}
          {product.description && (
            <div className="border-t border-border pt-5">
              <h2 className="mb-3 font-semibold">
                <T k="pdp.details" />
              </h2>
              <div
                className="prose prose-sm max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="mt-16">
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-semibold">
              <T k="pdp.reviews" />
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {avgRating.toFixed(1)} <T k="pdp.reviewsOutOf" /> · {reviewCount}
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
