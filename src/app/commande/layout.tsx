import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commander — Livraison de chicha à Paris",
  description:
    "Composez votre chicha et commandez-la en ligne. Livraison à Paris et en Île-de-France, sur créneau ou en spontané dès 21h.",
};

export default function CommandeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
