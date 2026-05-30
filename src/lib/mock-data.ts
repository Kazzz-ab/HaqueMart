import type { ProductListItem, Product } from "@/types";

const placeholder = (seed: string) =>
  `https://picsum.photos/seed/${seed}/800/600`;

export const MOCK_PRODUCTS: ProductListItem[] = [
  {
    id: "mock-1", databaseId: 1,
    name: "Minimalist Canvas Tote", slug: "minimalist-canvas-tote",
    price: "£24.99", regularPrice: "£24.99", salePrice: null,
    stockStatus: "IN_STOCK",
    image: { sourceUrl: placeholder("tote-bag"), altText: "Minimalist Canvas Tote" },
    productCategories: { nodes: [{ name: "Bags", slug: "bags" }] },
  },
  {
    id: "mock-2", databaseId: 2,
    name: "Matte Ceramic Pour-Over Set", slug: "matte-ceramic-pour-over-set",
    price: "£34.99", regularPrice: "£44.99", salePrice: "£34.99",
    stockStatus: "IN_STOCK",
    image: { sourceUrl: placeholder("coffee-set"), altText: "Ceramic Pour-Over Set" },
    productCategories: { nodes: [{ name: "Kitchen", slug: "kitchen" }] },
  },
  {
    id: "mock-3", databaseId: 3,
    name: "Bamboo Desk Organiser", slug: "bamboo-desk-organiser",
    price: "£19.99", regularPrice: "£19.99", salePrice: null,
    stockStatus: "IN_STOCK",
    image: { sourceUrl: placeholder("desk-organiser"), altText: "Bamboo Desk Organiser" },
    productCategories: { nodes: [{ name: "Home Office", slug: "home-office" }] },
  },
  {
    id: "mock-4", databaseId: 4,
    name: "Merino Wool Beanie", slug: "merino-wool-beanie",
    price: "£18.00", regularPrice: "£25.00", salePrice: "£18.00",
    stockStatus: "IN_STOCK",
    image: { sourceUrl: placeholder("beanie-hat"), altText: "Merino Wool Beanie" },
    productCategories: { nodes: [{ name: "Clothing", slug: "clothing" }] },
  },
  {
    id: "mock-5", databaseId: 5,
    name: "Linen Cushion Cover – Sage", slug: "linen-cushion-cover-sage",
    price: "£14.99", regularPrice: "£14.99", salePrice: null,
    stockStatus: "IN_STOCK",
    image: { sourceUrl: placeholder("cushion-cover"), altText: "Linen Cushion Cover" },
    productCategories: { nodes: [{ name: "Home", slug: "home" }] },
  },
  {
    id: "mock-6", databaseId: 6,
    name: "Stainless Water Bottle 750ml", slug: "stainless-water-bottle-750ml",
    price: "£22.00", regularPrice: "£22.00", salePrice: null,
    stockStatus: "IN_STOCK",
    image: { sourceUrl: placeholder("water-bottle"), altText: "Stainless Water Bottle" },
    productCategories: { nodes: [{ name: "Outdoors", slug: "outdoors" }] },
  },
  {
    id: "mock-7", databaseId: 7,
    name: "Scented Soy Candle – Cedarwood", slug: "scented-soy-candle-cedarwood",
    price: "£12.99", regularPrice: "£16.99", salePrice: "£12.99",
    stockStatus: "IN_STOCK",
    image: { sourceUrl: placeholder("soy-candle"), altText: "Scented Soy Candle" },
    productCategories: { nodes: [{ name: "Home", slug: "home" }] },
  },
  {
    id: "mock-8", databaseId: 8,
    name: "Leather A5 Notebook", slug: "leather-a5-notebook",
    price: "£17.50", regularPrice: "£17.50", salePrice: null,
    stockStatus: "OUT_OF_STOCK",
    image: { sourceUrl: placeholder("leather-notebook"), altText: "Leather A5 Notebook" },
    productCategories: { nodes: [{ name: "Stationery", slug: "stationery" }] },
  },
];

export const MOCK_PRODUCT_MAP: Record<string, Product> = Object.fromEntries(
  MOCK_PRODUCTS.map((p) => [
    p.slug,
    {
      ...p,
      description: `<p>A beautifully crafted ${p.name.toLowerCase()}. Made with quality materials and designed to last.</p>`,
      shortDescription: `Quality ${p.name.toLowerCase()} — perfect for everyday use.`,
      stockQuantity: p.stockStatus === "IN_STOCK" ? 15 : 0,
      galleryImages: { nodes: [] },
    },
  ])
);

export const MOCK_CATEGORIES = [
  "Bags", "Kitchen", "Home Office", "Clothing", "Home", "Outdoors", "Stationery",
];
