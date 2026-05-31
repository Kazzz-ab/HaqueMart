import { ProductGrid } from "@/components/ProductGrid";
import { NewsletterSection } from "@/components/NewsletterSection";
import { isWpConfigured } from "@/lib/graphql/client";
import { getProducts, getCategories } from "@/lib/graphql/products";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";
import type { ProductListItem } from "@/types";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ category?: string; q?: string }>;
}

const CATEGORY_SHOWCASE = [
  { name: "Bags",        slug: "bags",        emoji: "👜", desc: "Totes, backpacks & more" },
  { name: "Kitchen",     slug: "kitchen",     emoji: "☕", desc: "Brew & cook in style" },
  { name: "Home Office", slug: "home-office", emoji: "🖊️",  desc: "Level up your desk" },
  { name: "Clothing",    slug: "clothing",    emoji: "🧢", desc: "Cosy everyday wear" },
  { name: "Home",        slug: "home",        emoji: "🕯️",  desc: "Make your space yours" },
  { name: "Outdoors",    slug: "outdoors",    emoji: "🏕️",  desc: "Gear up for adventure" },
];

export default async function HomePage({ searchParams }: Props) {
  const { category, q } = await searchParams;
  const searchQuery = q?.trim().toLowerCase() ?? "";

  let products: ProductListItem[] = [];
  let categories: string[] = [];
  let usingMock = false;
  let hasNextPage = false;
  let endCursor: string | null = null;

  if (isWpConfigured()) {
    try {
      const [productsResult, categoryNames] = await Promise.all([
        getProducts({ first: 12, category }),
        getCategories(),
      ]);
      products = productsResult.nodes;
      hasNextPage = productsResult.hasNextPage;
      endCursor = productsResult.endCursor;
      categories = categoryNames;
    } catch {
      products = MOCK_PRODUCTS;
      categories = MOCK_CATEGORIES;
      usingMock = true;
    }
  } else {
    products = MOCK_PRODUCTS;
    categories = MOCK_CATEGORIES;
    usingMock = true;
  }

  const filtered = products.filter((p) => {
    const matchesCategory =
      !category ||
      p.productCategories.nodes.some(
        (c) => c.slug === category || c.name.toLowerCase() === category.toLowerCase(),
      );
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const canLoadMore = !searchQuery && hasNextPage;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col gap-16">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/10 px-8 py-14 text-center">
        <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-primary/8 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 size-40 rounded-full bg-violet-400/10 blur-3xl" />
        <div className="relative">
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            New arrivals in store
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Quality goods,<br className="hidden sm:block" /> curated for you
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto mb-6 text-base sm:text-lg">
            Discover hand-picked everyday essentials and thoughtful gifts — made to last.
          </p>
          <a
            href="#products"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/85 hover:shadow-lg active:translate-y-px"
          >
            Shop all products →
          </a>
        </div>
      </section>

      {/* Demo banner */}
      {usingMock && (
        <div className="-mt-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>Demo mode</strong> — showing sample products. Connect a WooCommerce store via{" "}
          <code className="rounded bg-amber-100 px-1 text-xs">NEXT_PUBLIC_WP_GRAPHQL_URL</code> to
          display live inventory.
        </div>
      )}

      {/* Products section */}
      <section id="products" className="flex flex-col gap-6">
        {searchQuery && (
          <p className="text-sm text-muted-foreground">
            {filtered.length > 0
              ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for `
              : "No results for "}
            <strong className="text-foreground">&ldquo;{q}&rdquo;</strong>
            {" · "}
            <a href="/" className="underline underline-offset-2 hover:text-foreground">
              clear search
            </a>
          </p>
        )}

        {!searchQuery && categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <a
              href="/"
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                !category
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border hover:bg-muted"
              }`}
            >
              All
            </a>
            {categories.map((cat) => {
              const slug = cat.toLowerCase().replace(/\s+/g, "-");
              const active = category === slug || category === cat.toLowerCase();
              return (
                <a
                  key={cat}
                  href={`/?category=${slug}`}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {cat}
                </a>
              );
            })}
          </div>
        )}

        <ProductGrid
          initialProducts={filtered}
          initialHasNextPage={canLoadMore}
          initialEndCursor={endCursor}
          category={category}
        />
      </section>

      {/* Shop by category */}
      {!searchQuery && !category && (
        <section className="flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Shop by category</h2>
            <p className="mt-1 text-muted-foreground">Find exactly what you&apos;re looking for</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {CATEGORY_SHOWCASE.map(({ name, slug, emoji, desc }) => (
              <a
                key={slug}
                href={`/?category=${slug}`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <span className="text-3xl transition-transform duration-200 group-hover:scale-110">
                  {emoji}
                </span>
                <span className="font-semibold">{name}</span>
                <span className="text-xs text-muted-foreground">{desc}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}
