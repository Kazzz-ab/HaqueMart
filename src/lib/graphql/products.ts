import { wpgql } from "./client";
import { GET_PRODUCTS, GET_PRODUCT } from "./queries";
import type { ProductsResponse, ProductResponse, Product, ProductListItem } from "@/types";

export async function getProducts(opts: {
  first?: number;
  after?: string;
  category?: string;
} = {}): Promise<{ nodes: ProductListItem[]; hasNextPage: boolean; endCursor: string | null }> {
  const data = await wpgql<ProductsResponse>(GET_PRODUCTS, {
    first: opts.first ?? 12,
    after: opts.after ?? null,
    category: opts.category ?? null,
  });
  return {
    nodes: data.products.nodes,
    hasNextPage: data.products.pageInfo.hasNextPage,
    endCursor: data.products.pageInfo.endCursor,
  };
}

export async function getProduct(slug: string): Promise<Product | null> {
  const data = await wpgql<ProductResponse>(GET_PRODUCT, { slug });
  return data.product;
}
