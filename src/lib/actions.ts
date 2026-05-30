"use server";

import { isWpConfigured } from "./graphql/client";
import { getProducts } from "./graphql/products";
import type { ProductListItem } from "@/types";

interface LoadMoreResult {
  nodes: ProductListItem[];
  hasNextPage: boolean;
  endCursor: string | null;
}

export async function fetchMoreProducts(
  cursor: string,
  category?: string,
): Promise<LoadMoreResult> {
  if (!isWpConfigured()) {
    return { nodes: [], hasNextPage: false, endCursor: null };
  }
  try {
    return await getProducts({ first: 12, after: cursor, category });
  } catch {
    return { nodes: [], hasNextPage: false, endCursor: null };
  }
}
