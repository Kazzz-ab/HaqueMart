import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart/context";
import { WishlistProvider } from "@/lib/wishlist/context";
import { LocaleProvider } from "@/lib/i18n/locale";
import { CurrencyProvider } from "@/lib/i18n/currency";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { RevealInit } from "@/components/RevealInit";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "HaqueMart — Quality goods, delivered worldwide",
  description:
    "A curated global storefront for considered goods. Sourced responsibly, priced in your currency, shipped worldwide.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <SmoothScrollProvider>
          <LocaleProvider>
            <CurrencyProvider>
              <WishlistProvider>
                <CartProvider>
                  <AnnouncementBar />
                  <Navbar />
                  <CartDrawer />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </CartProvider>
              </WishlistProvider>
            </CurrencyProvider>
          </LocaleProvider>
          <RevealInit />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
