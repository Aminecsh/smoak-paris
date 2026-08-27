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

const SITE_URL = "https://smoak-paris.vercel.app";
const SITE_TITLE = "Smoak Paris — Livraison de chicha à Paris et en Île-de-France";
const SITE_DESCRIPTION =
  "Livraison de chicha premium (sans tabac ni nicotine) à Paris et en Île-de-France. Commandez en ligne, une chicha prête à fumer livrée chez vous par notre équipe.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Smoak Paris",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "smoak paris",
    "livraison chicha paris",
    "livraison chicha",
    "chicha paris",
    "narguilé livraison paris",
    "location chicha paris",
    "chicha sans tabac",
    "chicha sans nicotine",
    "chicha île-de-france",
  ],
  applicationName: "Smoak Paris",
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "Smoak Paris",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/hero-poster.jpg",
        width: 1920,
        height: 1080,
        alt: "Chicha Smoak Paris livrée à domicile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/hero-poster.jpg"],
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Smoak Paris",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/hero-poster.jpg`,
  priceRange: "€€",
  address: {
    "@type": "PostalAddress",
    streetAddress: "8 rue Tronchet",
    addressLocality: "Paris",
    addressCountry: "FR",
  },
  areaServed: {
    "@type": "State",
    name: "Île-de-France",
  },
  email: "smoak.paris@gmail.com",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${sora.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <CartProvider>
          <Header />
          <MainShell>{children}</MainShell>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
