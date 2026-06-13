"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale";
import { ProductGrid } from "@/components/ProductGrid";
import type { ProductListItem } from "@/types";

interface Props {
  products: ProductListItem[];
  hasNextPage: boolean;
  endCursor: string | null;
  category?: string;
  categories: string[];
  query?: string;
}

function titleCase(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ShopSection({ products, hasNextPage, endCursor, category, categories, query }: Props) {
  const { t } = useLocale();
  const searching = Boolean(query && query.trim());

  const activeCategoryName = category
    ? (categories.find((c) => c.toLowerCase().replace(/\s+/g, "-") === category) ?? titleCase(category))
    : null;

  return (
    <section id="products" className="flex scroll-mt-24 flex-col gap-7">
      {searching ? (
        <p className="text-sm text-muted-foreground">
          {products.length} {t("products.resultsFor")}{" "}
          <strong className="text-foreground">“{query}”</strong>
          {" · "}
          <Link href="/" className="text-primary underline-offset-4 hover:underline">
            {t("products.clear")}
          </Link>
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              {t("products.eyebrow")}
            </p>
            <h2 className="font-heading mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {activeCategoryName ?? t("products.title")}
            </h2>
            {!activeCategoryName && (
              <p className="mt-2 text-muted-foreground">{t("products.subtitle")}</p>
            )}
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Link
                href="/"
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  !category
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-accent"
                }`}
              >
                {t("products.all")}
              </Link>
              {categories.map((cat) => {
                const slug = cat.toLowerCase().replace(/\s+/g, "-");
                const active = category === slug || category === cat.toLowerCase();
                return (
                  <Link
                    key={cat}
                    href={`/?category=${slug}`}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    {cat}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      <ProductGrid
        initialProducts={products}
        initialHasNextPage={hasNextPage}
        initialEndCursor={endCursor}
        category={category}
      />
    </section>
  );
}
