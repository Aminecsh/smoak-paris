import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MainShell from "@/components/MainShell";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Smoak Paris — Livraison chicha express",
  description: "Chicha premium livrée chez vous en moins d'une heure, à Paris.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${sora.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-ink">
        <CartProvider>
          <Header />
          <MainShell>{children}</MainShell>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
