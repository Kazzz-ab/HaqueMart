import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart/context";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HaqueMart — Quality goods, delivered",
  description:
    "A modern headless WooCommerce storefront. Browse our curated collection of quality products.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} HaqueMart · Powered by WooCommerce + Next.js
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
