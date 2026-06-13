// ── WPGraphQL / WooCommerce shapes ────────────────────────────────────────────

export interface WPImage {
  sourceUrl: string;
  altText: string;
}

export interface ProductCategory {
  name: string;
  slug: string;
}

/** Minimal product shape used in listing grids */
export interface ProductListItem {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  /** Numeric amounts in the base currency (USD) — source of truth for display */
  priceAmount: number | null;
  regularPriceAmount: number | null;
  salePriceAmount: number | null;
  /** Raw WooCommerce formatted strings (live data only) */
  price?: string | null;
  regularPrice?: string | null;
  salePrice?: string | null;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER";
  image: WPImage | null;
  productCategories: { nodes: ProductCategory[] };
  // ── Social-proof fields (populated from mock data or custom meta) ──
  rating?: number;
  reviewCount?: number;
  stockCount?: number;
  badge?: "best-seller" | "new";
}

/** Full product shape used on the detail page */
export interface Product extends ProductListItem {
  description: string;
  shortDescription: string;
  stockQuantity: number | null;
  galleryImages: { nodes: WPImage[] };
  reviews?: MockReview[];
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface ProductsResponse {
  products: {
    pageInfo: PageInfo;
    nodes: ProductListItem[];
  };
}

export interface ProductResponse {
  product: Product | null;
}

// ── Cart ──────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: number;
  name: string;
  slug: string;
  /** Unit price in the base currency (USD); formatted at render via <Price> */
  price: number;
  quantity: number;
  image: WPImage | null;
}

export interface Cart {
  items: CartItem[];
  /** Sum of (price × qty) for all items */
  total: number;
  /** Total number of units across all line items */
  itemCount: number;
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export interface MockReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  body: string;
  verified: boolean;
}
