import type { ProductListItem, Product, MockReview, WPImage } from "@/types";

// ── Curated photography (verified Unsplash IDs) ───────────────────────────────
// All amounts below are in the BASE currency (USD); the currency provider
// converts + formats them to the shopper's selected currency at render time.

const U = "https://images.unsplash.com/photo-";
const img = (id: string, w = 1000) => `${U}${id}?auto=format&fit=crop&w=${w}&q=80`;

/** Build a small gallery from one photo using crop/treatment variants. */
function galleryFor(id: string, name: string): { nodes: WPImage[] } {
  const base = `${U}${id}?auto=format&fit=crop&w=1100&q=80`;
  return {
    nodes: [
      { sourceUrl: base, altText: `${name} — view 1` },
      { sourceUrl: `${base}&crop=entropy`, altText: `${name} — view 2` },
      { sourceUrl: `${base}&sat=-45`, altText: `${name} — detail` },
    ],
  };
}

const PHOTO: Record<string, string> = {
  "mock-1": "1544816155-12df9643f363", // canvas tote
  "mock-2": "1442512595331-e89e73853f31", // pour-over coffee
  "mock-3": "1496128858413-b36217c2ce36", // desk organiser
  "mock-4": "1511500118080-275313ec90a1", // merino beanie
  "mock-5": "1512880366380-a8446f4321e1", // linen cushion
  "mock-6": "1523362628745-0c100150b504", // water bottle
  "mock-7": "1585641689080-2e530457803b", // soy candle
  "mock-8": "1550517355-375c103a6a81", // leather notebook
};

// ── Shared review pool ────────────────────────────────────────────────────────

const REVIEWS: Record<string, MockReview[]> = {
  "mock-1": [
    { id: "r1a", author: "Sarah M.", rating: 5, date: "12 May 2026", verified: true, body: "Perfect everyday bag! The canvas quality is excellent and it holds so much more than you'd expect. Three months in and it still looks brand new — absolutely worth every penny." },
    { id: "r1b", author: "Jake T.", rating: 5, date: "3 Apr 2026", verified: true, body: "Bought this as a gym bag replacement and I'm obsessed. The clean design goes with everything and the handles are really comfortable even when loaded up." },
    { id: "r1c", author: "Priya K.", rating: 4, date: "18 Mar 2026", verified: false, body: "Great quality for the price. Stitching is solid and handles are comfortable. Only wish it had an internal zip pocket — losing my keys is a daily struggle." },
  ],
  "mock-2": [
    { id: "r2a", author: "Tom R.", rating: 5, date: "20 May 2026", verified: true, body: "Makes my morning coffee ritual feel like a luxury experience. The ceramic quality is incredible — smooth finish, perfect weight, keeps my pour-over consistently excellent." },
    { id: "r2b", author: "Emma L.", rating: 5, date: "7 May 2026", verified: true, body: "Beautiful set that genuinely brews a better cup. My friends always comment on it when they visit. Worth every penny and a joy to use every single morning." },
    { id: "r2c", author: "Chris N.", rating: 4, date: "29 Apr 2026", verified: true, body: "Stunning piece. The matte finish is gorgeous and it looks incredible on my counter. A little slow to pour but that's pour-over — just adds to the ritual." },
  ],
  "mock-3": [
    { id: "r3a", author: "Alex B.", rating: 5, date: "25 Apr 2026", verified: true, body: "Finally a desk organiser that actually looks good! The bamboo is high quality, smells lovely, and cleared up so much clutter. My home office has never looked better." },
    { id: "r3b", author: "Mia S.", rating: 4, date: "10 Apr 2026", verified: true, body: "Really solid and well made. Fits all my pens, sticky notes, and phone without looking cluttered. Slightly smaller than I expected but works perfectly for my setup." },
    { id: "r3c", author: "Dan W.", rating: 5, date: "2 Apr 2026", verified: false, body: "Bought two of these — one for home and one for the office. The bamboo has a really premium feel and the compartment sizes are very well thought out." },
  ],
  "mock-4": [
    { id: "r4a", author: "Olivia H.", rating: 5, date: "28 May 2026", verified: true, body: "THE softest beanie I've ever owned. Merino wool is incredibly warm without being itchy. I've washed it three times and it looks exactly the same. Absolute must-have." },
    { id: "r4b", author: "Ben K.", rating: 5, date: "15 May 2026", verified: true, body: "Bought this for winter hiking and it's been incredible. Warm, lightweight, and looks stylish enough to wear into town too. Already bought one for my partner." },
    { id: "r4c", author: "Zara F.", rating: 5, date: "4 May 2026", verified: true, body: "Gifted this to my brother and he won't stop raving about it. The fit is perfect and the quality is clearly excellent. Will definitely be ordering more colours." },
  ],
  "mock-5": [
    { id: "r5a", author: "Lucy P.", rating: 5, date: "22 May 2026", verified: true, body: "This colour is stunning in person — the sage is much more beautiful than the photo. The linen texture is premium and it's already completely transformed my living room." },
    { id: "r5b", author: "Ryan O.", rating: 4, date: "9 May 2026", verified: true, body: "Great quality linen, arrived beautifully packaged. The colour is a lovely sage green. Docking one star only because the zip is slightly stiff — loosened up with use though." },
    { id: "r5c", author: "Hannah C.", rating: 5, date: "1 May 2026", verified: false, body: "Ordered three of these for my sofa and they look incredible together. The linen has a lovely natural texture and the sage is so calming. Will order more shades!" },
  ],
  "mock-6": [
    { id: "r6a", author: "Marcus J.", rating: 5, date: "18 May 2026", verified: true, body: "This bottle is an absolute game changer. Keeps my coffee hot for six hours and cold drinks ice cold all day. The finish is scratch-resistant and still looks brand new." },
    { id: "r6b", author: "Isla D.", rating: 5, date: "5 May 2026", verified: true, body: "Replaced my old bottle with this and the difference is massive. Solid feel, easy to clean, and the wide mouth is perfect for ice cubes. 100% recommend." },
    { id: "r6c", author: "Noah A.", rating: 4, date: "24 Apr 2026", verified: true, body: "Really well made and keeps drinks cold for hours. Lid is easy to open one-handed which is a game changer on walks. Slightly heavy but totally worth it for the quality." },
  ],
  "mock-7": [
    { id: "r7a", author: "Sophie B.", rating: 5, date: "26 May 2026", verified: true, body: "The cedarwood scent is perfect — warm and woody without being overpowering. Burns cleanly for hours and the soy wax means no soot. My living room smells amazing." },
    { id: "r7b", author: "Finn L.", rating: 5, date: "14 May 2026", verified: true, body: "Bought three as gifts and they were a massive hit. The packaging is gorgeous and the candle itself is high quality. Much nicer than the big brand candles at double the price." },
    { id: "r7c", author: "Ava M.", rating: 4, date: "2 May 2026", verified: true, body: "Really lovely candle with a subtle scent throw. Perfect for a bedroom or study. Would love a slightly stronger throw for a bigger room but otherwise perfect." },
  ],
  "mock-8": [
    { id: "r8a", author: "James T.", rating: 5, date: "8 May 2026", verified: true, body: "The leather quality on this notebook is exceptional. Soft, supple, and already developing a beautiful patina. The paper inside is thick enough to use fountain pens without bleed-through." },
    { id: "r8b", author: "Chloe R.", rating: 4, date: "27 Apr 2026", verified: true, body: "Gorgeous notebook — feels luxurious in hand. The A5 size is perfect for work notes. Only slight issue is it was out of stock when I first tried to order; well worth the wait!" },
    { id: "r8c", author: "Leo G.", rating: 5, date: "15 Apr 2026", verified: false, body: "Bought as a birthday gift and the recipient was genuinely thrilled. The leather smells incredible straight out of the box and the stitching is immaculate. Highly recommend." },
  ],
};

// ── Product listings (prices are USD base amounts) ────────────────────────────

export const MOCK_PRODUCTS: ProductListItem[] = [
  {
    id: "mock-1", databaseId: 1,
    name: "Minimalist Canvas Tote", slug: "minimalist-canvas-tote",
    priceAmount: 32, regularPriceAmount: 32, salePriceAmount: null,
    stockStatus: "IN_STOCK",
    image: { sourceUrl: img(PHOTO["mock-1"]), altText: "Minimalist Canvas Tote" },
    productCategories: { nodes: [{ name: "Bags", slug: "bags" }] },
    rating: 4.7, reviewCount: 83, stockCount: 28, badge: "best-seller",
  },
  {
    id: "mock-2", databaseId: 2,
    name: "Matte Ceramic Pour-Over Set", slug: "matte-ceramic-pour-over-set",
    priceAmount: 44, regularPriceAmount: 58, salePriceAmount: 44,
    stockStatus: "IN_STOCK",
    image: { sourceUrl: img(PHOTO["mock-2"]), altText: "Matte Ceramic Pour-Over Set" },
    productCategories: { nodes: [{ name: "Kitchen", slug: "kitchen" }] },
    rating: 4.6, reviewCount: 61, stockCount: 19,
  },
  {
    id: "mock-3", databaseId: 3,
    name: "Bamboo Desk Organiser", slug: "bamboo-desk-organiser",
    priceAmount: 26, regularPriceAmount: 26, salePriceAmount: null,
    stockStatus: "IN_STOCK",
    image: { sourceUrl: img(PHOTO["mock-3"]), altText: "Bamboo Desk Organiser" },
    productCategories: { nodes: [{ name: "Home Office", slug: "home-office" }] },
    rating: 4.4, reviewCount: 47, stockCount: 34,
  },
  {
    id: "mock-4", databaseId: 4,
    name: "Merino Wool Beanie", slug: "merino-wool-beanie",
    priceAmount: 24, regularPriceAmount: 34, salePriceAmount: 24,
    stockStatus: "IN_STOCK",
    image: { sourceUrl: img(PHOTO["mock-4"]), altText: "Merino Wool Beanie" },
    productCategories: { nodes: [{ name: "Clothing", slug: "clothing" }] },
    rating: 4.8, reviewCount: 124, stockCount: 4, badge: "best-seller",
  },
  {
    id: "mock-5", databaseId: 5,
    name: "Linen Cushion Cover — Sage", slug: "linen-cushion-cover-sage",
    priceAmount: 19, regularPriceAmount: 19, salePriceAmount: null,
    stockStatus: "IN_STOCK",
    image: { sourceUrl: img(PHOTO["mock-5"]), altText: "Linen Cushion Cover in sage" },
    productCategories: { nodes: [{ name: "Home", slug: "home" }] },
    rating: 4.3, reviewCount: 39, stockCount: 22, badge: "new",
  },
  {
    id: "mock-6", databaseId: 6,
    name: "Stainless Water Bottle 750ml", slug: "stainless-water-bottle-750ml",
    priceAmount: 29, regularPriceAmount: 29, salePriceAmount: null,
    stockStatus: "IN_STOCK",
    image: { sourceUrl: img(PHOTO["mock-6"]), altText: "Stainless Water Bottle" },
    productCategories: { nodes: [{ name: "Outdoors", slug: "outdoors" }] },
    rating: 4.5, reviewCount: 92, stockCount: 16, badge: "best-seller",
  },
  {
    id: "mock-7", databaseId: 7,
    name: "Scented Soy Candle — Cedarwood", slug: "scented-soy-candle-cedarwood",
    priceAmount: 17, regularPriceAmount: 22, salePriceAmount: 17,
    stockStatus: "IN_STOCK",
    image: { sourceUrl: img(PHOTO["mock-7"]), altText: "Scented Soy Candle in cedarwood" },
    productCategories: { nodes: [{ name: "Home", slug: "home" }] },
    rating: 4.6, reviewCount: 58, stockCount: 31,
  },
  {
    id: "mock-8", databaseId: 8,
    name: "Leather A5 Notebook", slug: "leather-a5-notebook",
    priceAmount: 23, regularPriceAmount: 23, salePriceAmount: null,
    stockStatus: "OUT_OF_STOCK",
    image: { sourceUrl: img(PHOTO["mock-8"]), altText: "Leather A5 Notebook" },
    productCategories: { nodes: [{ name: "Home Office", slug: "home-office" }] },
    rating: 4.2, reviewCount: 29, stockCount: 0,
  },
];

export const MOCK_PRODUCT_MAP: Record<string, Product> = Object.fromEntries(
  MOCK_PRODUCTS.map((p) => [
    p.slug,
    {
      ...p,
      description: `<p>A beautifully made ${p.name.toLowerCase()}, considered down to the last detail. Crafted from quality materials and built to last — the kind of everyday object that quietly earns its place.</p><p>Sourced responsibly and shipped worldwide, with transparent pricing in your local currency.</p>`,
      shortDescription: `A considered ${p.name.toLowerCase()} — quality materials, made to last.`,
      stockQuantity: p.stockStatus === "IN_STOCK" ? (p.stockCount ?? 10) : 0,
      galleryImages: galleryFor(PHOTO[p.id], p.name),
      reviews: REVIEWS[p.id] ?? [],
    },
  ]),
);

export const MOCK_CATEGORIES = [
  "Bags", "Kitchen", "Home Office", "Clothing", "Home", "Outdoors",
];

// ── Editorial imagery for the storefront ──────────────────────────────────────

export const HERO_IMAGE = img("1467043153537-a4fba2cd39ef", 1600);
export const STORY_IMAGE = img("1500067803284-4304564c8655", 1200);

export interface CollectionTile {
  name: string;
  slug: string;
  image: string;
}

export const COLLECTION_SHOWCASE: CollectionTile[] = [
  { name: "Bags",        slug: "bags",        image: img("1506094543314-3747d5123bbe") },
  { name: "Kitchen",     slug: "kitchen",     image: img("1452251889946-8ff5ea7b27ab") },
  { name: "Home Office", slug: "home-office", image: img("1452601395039-3184bc03cb09") },
  { name: "Clothing",    slug: "clothing",    image: img("1517677208171-0bc6725a3e60") },
  { name: "Home",        slug: "home",        image: img("1602516793068-35b73edf3368") },
  { name: "Outdoors",    slug: "outdoors",    image: img("1414016642750-7fdd78dc33d9") },
];
