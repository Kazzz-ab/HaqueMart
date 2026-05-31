# HaqueMart — Architecture

> A headless WooCommerce storefront: WordPress handles the product catalogue, orders, and inventory via WooCommerce; a Next.js frontend consumes it over WPGraphQL. Falls back gracefully to curated mock data when the WordPress backend is not configured.

## "Done" spec (v1 scope)

A shopper can browse a product catalogue (with category filters and search), view a product detail page, add items to a persistent cart, and complete a checkout flow with an order confirmation. Deployed on Vercel. Stripe test-mode payment is a stretch goal for Week 3.

## System overview

```
Browser
  │
  └─► Next.js 15 App Router (Vercel)
            │
            ├─► WPGraphQL endpoint  ──►  WordPress + WooCommerce
            │   (getProducts, getProduct, getCategories)        (product data, inventory)
            │
            └─► Mock data fallback
                (MOCK_PRODUCTS / MOCK_CATEGORIES when WP not configured)
```

## Key components

### Data layer (`src/lib/graphql/`)
- `client.ts` — thin `fetch` wrapper around the WPGraphQL endpoint; `isWpConfigured()` gate drives the mock fallback.
- `queries.ts` — raw GraphQL query strings (products list, single product, categories).
- `products.ts` — typed wrappers: `getProducts({ first, after, category })`, `getProduct(slug)`, `getCategories()`.

### Pages (`src/app/`)
| Route | Notes |
|-------|-------|
| `/` | Product grid with category filter bar, text search, load-more pagination |
| `/products/[slug]` | Product detail: images, price, stock status, quantity selector, add-to-cart, reviews |
| `/checkout` | Address form + order summary; simulated submit (Stripe in Week 3) |
| `/checkout/success` | Order confirmation with generated order ID |

### State
- **Cart** — React context + `localStorage` persistence (`src/lib/cart/context.tsx`). Survives page reload.
- **Wishlist** — same pattern (`src/lib/wishlist/context.tsx`).

### UI
shadcn/ui components on a dark amber-on-charcoal design system (Tailwind CSS). Fully responsive.

## Tech decisions

| Decision | Choice | Why |
|----------|--------|-----|
| CMS/backend | WordPress + WooCommerce | Industry-standard headless commerce backend; WPGraphQL is the de-facto bridge |
| API layer | WPGraphQL | Typed, filterable product queries without REST pagination hacks |
| Frontend | Next.js 15 App Router | Server components for data fetching; no API key exposure |
| Hosting | Vercel | Zero-config Next.js deploys |
| Payments | Stripe (Week 3) | Test-mode integration; mock checkout ships first |

## Mock fallback

`NEXT_PUBLIC_WP_GRAPHQL_URL` is required to connect to a live WooCommerce store. When absent (or when the endpoint errors), the site renders `MOCK_PRODUCTS` — a curated set of 8 products with reviews, images via Picsum, and realistic prices. The UI shows a "Demo mode" banner so the distinction is clear.

## Explicit non-goals (v1)

No user accounts, no real payment processing (Week 3 stretch), no inventory sync, no CMS content beyond product data.
