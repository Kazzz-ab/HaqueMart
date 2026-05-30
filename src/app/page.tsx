import { ProductCard } from "@/components/ProductCard";
import { isWpConfigured } from "@/lib/graphql/client";
import { getProducts } from "@/lib/graphql/products";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";
import type { ProductListItem } from "@/types";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function HomePage({ searchParams }: Props) {
  const { category } = await searchParams;

  let products: ProductListItem[] = [];
  let categories: string[] = [];
  let usingMock = false;

  if (isWpConfigured()) {
    try {
      const result = await getProducts({ first: 12, category });
      products = result.nodes;
      categories = [
        ...new Set(
          products.flatMap((p) => p.productCategories.nodes.map((c) => c.name)),
        ),
      ];
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

  const filtered = category
    ? products.filter((p) =>
        p.productCategories.nodes.some(
          (c) => c.slug === category || c.name.toLowerCase() === category.toLowerCase(),
        ),
      )
    : products;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      {/* Hero */}
      <section className="mb-12 rounded-2xl bg-primary/5 border border-primary/10 px-8 py-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Quality goods, curated for you
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Discover our hand-picked collection of everyday essentials and thoughtful gifts.
        </p>
      </section>

      {/* Demo banner */}
      {usingMock && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>Demo mode</strong> — showing sample products. Connect a WooCommerce store via{" "}
          <code className="text-xs bg-amber-100 px-1 rounded">NEXT_PUBLIC_WP_GRAPHQL_URL</code> to
          display live inventory.
        </div>
      )}

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <a
            href="/"
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              !category
                ? "border-primary bg-primary text-primary-foreground"
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
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-muted"
                }`}
              >
                {cat}
              </a>
            );
          })}
        </div>
      )}

      {/* Product grid */}
      {filtered.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          No products found in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
