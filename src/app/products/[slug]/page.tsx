import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, Star, ShieldCheck, RefreshCw, Zap, ThumbsUp, BadgeCheck } from "lucide-react";
import { isWpConfigured } from "@/lib/graphql/client";
import { getProduct } from "@/lib/graphql/products";
import { MOCK_PRODUCT_MAP } from "@/lib/mock-data";
import { parsePrice, formatPrice } from "@/lib/utils";
import { ProductActions } from "@/components/ProductActions";
import { ProductUrgency } from "@/components/ProductUrgency";
import type { Product, MockReview } from "@/types";

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

  const description = product.shortDescription
    ?.replace(/<[^>]+>/g, "")
    .slice(0, 160) ?? `Shop ${product.name} at HaqueMart`;

  return {
    title: `${product.name} — HaqueMart`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.image
        ? [{ url: product.image.sourceUrl, alt: product.image.altText }]
        : [],
    },
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`size-4 ${
              i < Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
      <span className="text-sm text-muted-foreground">({count} reviews)</span>
    </div>
  );
}

function ReviewCard({ review }: { review: MockReview }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
            {review.author[0]}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold">{review.author}</span>
              {review.verified && (
                <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                  <BadgeCheck className="size-3.5" /> Verified
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
              className={`size-3.5 ${
                i < review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{review.body}</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await resolveProduct(slug);
  if (!product) notFound();

  const isOnSale = product.salePrice !== null && product.salePrice !== product.regularPrice;
  const isOutOfStock = product.stockStatus === "OUT_OF_STOCK";
  const isLowStock = !isOutOfStock && product.stockCount !== undefined && product.stockCount <= 5;
  const displayPrice = product.price ?? product.regularPrice ?? "£0";
  const category = product.productCategories.nodes[0];
  const avgRating = product.rating ?? 4.5;
  const reviewCount = product.reviewCount ?? 0;
  const reviews = product.reviews ?? [];

  const savings =
    isOnSale && product.regularPrice
      ? parsePrice(product.regularPrice) - parsePrice(product.price)
      : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">

      {/* ── Breadcrumb ── */}
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3.5" />
        {category && (
          <>
            <Link
              href={`/?category=${category.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {category.name}
            </Link>
            <ChevronRight className="size-3.5" />
          </>
        )}
        <span className="truncate text-foreground font-medium">{product.name}</span>
      </nav>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-sm">
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
          {isOnSale && (
            <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow">
              Sale — save {formatPrice(savings)}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">

          {/* Category + name */}
          {category && (
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              {category.name}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{product.name}</h1>

          {/* Stars */}
          {reviewCount > 0 && (
            <StarRating rating={avgRating} count={reviewCount} />
          )}

          {/* Live social proof */}
          <ProductUrgency
            viewingSeed={product.viewingSeed ?? 6}
            inStock={!isOutOfStock}
          />

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className={`text-3xl font-bold ${isOnSale ? "text-primary" : ""}`}>
              {displayPrice}
            </span>
            {isOnSale && product.regularPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {product.regularPrice}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`size-2.5 rounded-full ${
                isOutOfStock ? "bg-destructive" : isLowStock ? "bg-orange-500" : "bg-emerald-500"
              }`}
            />
            {isOutOfStock ? (
              <span className="font-medium text-destructive">Out of stock</span>
            ) : isLowStock ? (
              <span className="font-semibold text-orange-600">
                Only {product.stockCount} left — order soon!
              </span>
            ) : (
              <span className="font-medium text-emerald-700">In stock — ready to ship</span>
            )}
          </div>

          {/* Short description */}
          {product.shortDescription && (
            <p
              className="leading-relaxed text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: product.shortDescription }}
            />
          )}

          {/* Add to cart + quantity */}
          <ProductActions
            item={{
              productId: product.databaseId,
              name: product.name,
              slug: product.slug,
              price: parsePrice(product.price ?? product.regularPrice),
              priceFormatted: displayPrice,
              image: product.image,
            }}
            disabled={isOutOfStock}
          />

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-muted/30 p-4">
            {[
              { icon: ShieldCheck, label: "Secure checkout", sub: "256-bit SSL" },
              { icon: Zap,         label: "Fast dispatch",   sub: "Order before 3pm" },
              { icon: RefreshCw,   label: "Free returns",    sub: "30-day guarantee" },
              { icon: ThumbsUp,    label: "4.8★ rated",      sub: "2,000+ reviews" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-2.5">
                <Icon className="size-4 shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-semibold">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Sold this week */}
          {product.soldThisWeek && product.soldThisWeek > 0 && (
            <p className="text-sm text-muted-foreground">
              🔥 <strong className="text-foreground">{product.soldThisWeek} people</strong> bought this in the last 7 days
            </p>
          )}

          {/* Full description */}
          {product.description && (
            <div className="border-t border-border pt-5">
              <h2 className="mb-3 font-semibold">Product details</h2>
              <div
                className="prose prose-sm max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Reviews ── */}
      {reviews.length > 0 && (
        <section className="mt-16">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Customer reviews</h2>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${
                        i < Math.round(avgRating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {avgRating.toFixed(1)} out of 5 · {reviewCount} reviews
                </span>
              </div>
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
