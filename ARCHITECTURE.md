# HaqueMart — Architecture

> A premium, **global-facing** headless WooCommerce storefront: WordPress handles the product catalogue, orders, and inventory via WooCommerce; a Next.js frontend consumes it over WPGraphQL and presents it in the shopper's currency and language (RTL-ready). Falls back gracefully to a curated mock catalogue when the WordPress backend is not configured.

## "Done" spec (v1 scope)

A shopper can browse a product catalogue (with category filters and search), view a product detail page, add items to a persistent cart, and complete a checkout flow with an order confirmation. Deployed on Vercel. Stripe test-mode payment is a stretch goal for Week 3.

## System overview

```
Browser
  │
  └─► Next.js 16 App Router (Vercel)
            │   client providers: Locale (i18n) + Currency wrap Cart + Wishlist
            │
            ├─► WPGraphQL endpoint  ──►  WordPress + WooCommerce
            │   (getProducts, getProduct, getCategories)        (product data, inventory)
            │   prices normalized to numeric base (USD) amounts
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
| `/` | Editorial homepage: image-led hero, feature strip, collections, product grid (category filter + search + load-more), brand story, testimonials, newsletter |
| `/products/[slug]` | Product detail: gallery, price, stock status, quantity selector, add-to-cart, reassurance block, verified reviews |
| `/checkout` | Internationalized address form (global country list) + order summary; simulated submit |
| `/checkout/success` | Order confirmation with generated order ID |

### Internationalization (`src/lib/i18n/`)
- `currency.tsx` — `CurrencyProvider` / `useCurrency()`: active currency, static demo FX table (base = USD), `convert()` + `format()`, persisted to `localStorage`.
- `locale.tsx` — `LocaleProvider` / `useLocale()` / `t()`: active language with English-fallback dictionary lookup; sets `<html lang/dir>` (RTL for Arabic), persisted.
- `regions.ts` — languages, currencies, regions (region preselects language + currency), and the checkout country list.
- `dictionaries/` — `en` (complete source of truth) + partial `es` / `fr` / `ar`.
- `components/Price.tsx` — single source of truth for rendering a base-USD amount in the shopper's currency.
- `components/LocaleSwitcher.tsx` — region · language · currency popover (navbar + footer).

### State
- **Cart** — React context + `localStorage` persistence (`src/lib/cart/context.tsx`); prices stored as numeric base (USD) amounts.
- **Wishlist** — same pattern (`src/lib/wishlist/context.tsx`).
- **Currency / Locale** — see Internationalization above.

### UI
shadcn/ui components on a **light editorial** design system (Tailwind CSS v4): warm ivory/stone neutrals, a deep teal/emerald jewel accent, Fraunces serif display + Geist body. Calm motion via GSAP + Lenis. No hard-sell FOMO — tasteful trust signals only. Fully responsive.

## Tech decisions

| Decision | Choice | Why |
|----------|--------|-----|
| CMS/backend | WordPress + WooCommerce | Industry-standard headless commerce backend; WPGraphQL is the de-facto bridge |
| API layer | WPGraphQL | Typed, filterable product queries without REST pagination hacks |
| Frontend | Next.js 16 App Router | Server components for data fetching; no API key exposure |
| Hosting | Vercel | Zero-config Next.js deploys |
| Payments | Stripe (Week 3) | Test-mode integration; mock checkout ships first |

## Mock fallback

`NEXT_PUBLIC_WP_GRAPHQL_URL` is required to connect to a live WooCommerce store. When absent (or when the endpoint errors), the site renders `MOCK_PRODUCTS` — a curated set of 8 products with reviews, curated Unsplash photography, and base-USD prices. The UI shows a subtle "Demo mode" banner so the distinction is clear.

## Explicit non-goals (v1)

No user accounts, no real payment processing, no inventory sync, no CMS content beyond product data. The i18n layer is **scaffolding**: currency conversion uses a static demo FX table and only the storefront chrome is translated (product copy stays in its source language).
