import { HeroSection } from "@/components/HeroSection";
import { FeatureStrip } from "@/components/home/FeatureStrip";
import { CollectionsSection } from "@/components/home/CollectionsSection";
import { ShopSection } from "@/components/home/ShopSection";
import { StorySection } from "@/components/home/StorySection";
import { Testimonials } from "@/components/home/Testimonials";
import { NewsletterSection } from "@/components/NewsletterSection";
import { isWpConfigured } from "@/lib/graphql/client";
import { getProducts, getCategories } from "@/lib/graphql/products";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";
import type { ProductListItem } from "@/types";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ category?: string; q?: string }>;
}

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
  const homeOnly = !searchQuery && !category;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="flex flex-col gap-20 py-10 sm:gap-24 sm:py-12">
        <HeroSection />

        {usingMock && (
          <div className="-mt-12 flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-xs text-muted-foreground sm:-mt-16">
            <span className="size-1.5 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold text-foreground">Demo mode</strong> — sample catalogue.
              Connect a WooCommerce store via{" "}
              <code className="rounded bg-background px-1 font-mono">NEXT_PUBLIC_WP_GRAPHQL_URL</code>{" "}
              for live inventory.
            </span>
          </div>
        )}

        <FeatureStrip />

        {homeOnly && <CollectionsSection />}

        <ShopSection
          products={filtered}
          hasNextPage={canLoadMore}
          endCursor={endCursor}
          category={category}
          categories={categories}
          query={q}
        />

        {homeOnly && <StorySection />}
        {homeOnly && <Testimonials />}

        <NewsletterSection />
      </div>
    </div>
  );
}
