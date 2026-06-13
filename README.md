# HaqueMart

**A premium, global-facing storefront for SMEs.** Headless WooCommerce commerce with a Next.js frontend — built to look and feel world-class in any market: priced in the shopper's currency, available in multiple languages (RTL-ready), and shipped worldwide. Ships with a curated mock catalogue so the demo works without a live WordPress backend.

**Live demo:** https://haquemart.vercel.app

## Stack

- **Next.js 16** (App Router) — server-rendered product pages, no API key exposure
- **WordPress + WooCommerce + WPGraphQL** — headless commerce backend
- **Tailwind CSS v4 + shadcn/ui** — light editorial design system (Fraunces serif display + Geist), deep teal/emerald jewel accent
- **i18n scaffolding** — currency + language + region providers (React context + `localStorage`), RTL-ready
- **GSAP + Lenis** — calm scroll reveals and smooth scrolling
- **React Context + localStorage** — cart and wishlist state

## Quickstart

```bash
# 1. Clone and install
git clone <repo-url>
cd haquemart
npm install

# 2. Set env vars
cp .env.example .env.local
# Optional: set NEXT_PUBLIC_WP_GRAPHQL_URL to your WooCommerce WPGraphQL endpoint
# Leave unset to run in demo mode with mock products

# 3. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without `NEXT_PUBLIC_WP_GRAPHQL_URL` the site runs in demo mode with sample products.

## Connecting a WooCommerce store

1. Install [WPGraphQL](https://www.wpgraphql.com/) and [WooGraphQL](https://woographql.com/) on your WordPress site.
2. Set `NEXT_PUBLIC_WP_GRAPHQL_URL=https://your-store.com/graphql` in `.env.local`.
3. Restart the dev server — live products replace the mock catalogue automatically.

> Product prices are stored as numeric **base-currency (USD)** amounts and converted/formatted to the shopper's selected currency at render. Live WooCommerce price strings are normalized into base amounts automatically.

## Features

- **Multi-currency** — shopper picks their currency (USD/EUR/GBP/JPY/INR/AED/AUD/CAD); every price reformats live and the choice persists
- **Multi-language + RTL** — English, Español, Français, العربية (Arabic flips the layout to RTL); a region picker preselects language + currency
- Editorial homepage: image-led hero, collections, brand story, testimonials
- Collections mega-menu, refined search, wishlist & cart
- Product detail with gallery, verified reviews, and tasteful trust signals (no hard-sell FOMO)
- Internationalized checkout (global country list) with order confirmation
- SEO: `sitemap.ts` + `robots.ts`
- Fully responsive, app-like on mobile

See [ARCHITECTURE.md](ARCHITECTURE.md) for full system design.
