import { wpgql } from "./client";
import { GET_PRODUCTS, GET_PRODUCT, GET_PRODUCT_CATEGORIES } from "./queries";
import { parsePrice } from "@/lib/utils";
import type { Product, ProductListItem } from "@/types";

interface CategoriesResponse {
  productCategories: { nodes: Array<{ name: string; slug: string; count: number }> };
}

// WooCommerce returns formatted price strings; our app works in numeric base
// amounts. These raw shapes mirror the query result before normalization.
type RawListNode = Omit<ProductListItem, "priceAmount" | "regularPriceAmount" | "salePriceAmount">;
type RawProduct = Omit<Product, "priceAmount" | "regularPriceAmount" | "salePriceAmount">;
interface RawProductsResponse {
  products: { pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes: RawListNode[] };
}
interface RawProductResponse {
  product: RawProduct | null;
}

/** Derive numeric base-currency amounts from WooCommerce formatted strings. */
function withAmounts<T extends RawListNode>(node: T) {
  const regular = node.regularPrice ? parsePrice(node.regularPrice) : null;
  const sale = node.salePrice ? parsePrice(node.salePrice) : null;
  const current = node.price ? parsePrice(node.price) : regular;
  return {
    ...node,
    priceAmount: current,
    regularPriceAmount: regular,
    salePriceAmount: sale,
  };
}

export async function getProducts(opts: {
  first?: number;
  after?: string;
  category?: string;
} = {}): Promise<{ nodes: ProductListItem[]; hasNextPage: boolean; endCursor: string | null }> {
  const data = await wpgql<RawProductsResponse>(GET_PRODUCTS, {
    first: opts.first ?? 12,
    after: opts.after ?? null,
    category: opts.category ?? null,
  });
  return {
    nodes: data.products.nodes.map(withAmounts),
    hasNextPage: data.products.pageInfo.hasNextPage,
    endCursor: data.products.pageInfo.endCursor,
  };
}

export async function getProduct(slug: string): Promise<Product | null> {
  const data = await wpgql<RawProductResponse>(GET_PRODUCT, { slug });
  return data.product ? withAmounts(data.product) : null;
}

export async function getCategories(): Promise<string[]> {
  const data = await wpgql<CategoriesResponse>(GET_PRODUCT_CATEGORIES);
  return data.productCategories.nodes
    .filter((c) => c.count > 0)
    .map((c) => c.name);
}
