import { Product } from "./types";

// Catalogue Smoak Paris — boissons fraîches / épicerie sucrée. La chicha
// (Quasar / Khaloud, goûts, recharge, suppléments) est composée à part via
// le composeur, voir src/lib/chicha.ts.
//
// ⚠️ Prix provisoires — à valider avant mise en vente. Restent aussi à
// définir : les formats/fournisseurs précis (canettes, jus, bonbons,
// chocolat Dubaï), les stocks de départ et les quantités maximum par
// commande.
export const products: Product[] = [
  // Boissons — canettes, énergisantes, 1,5 L et jus.
  {
    id: "canette-coca-cola",
    name: "Coca-Cola",
    description: "Canette.",
    price: 2.5,
    emoji: "🥤",
    category: "Boissons",
  },
  {
    id: "canette-oasis",
    name: "Oasis",
    description: "Canette.",
    price: 2.5,
    emoji: "🥤",
    category: "Boissons",
  },
  {
    id: "canette-hawaii",
    name: "Hawaii",
    description: "Canette.",
    price: 2.5,
    emoji: "🥤",
    category: "Boissons",
  },
  {
    id: "canette-dada",
    name: "Dada",
    description: "Canette.",
    price: 2.5,
    emoji: "🥤",
    category: "Boissons",
  },
  {
    id: "red-bull",
    name: "Red Bull",
    description: "Boisson énergisante.",
    price: 3.5,
    emoji: "⚡",
    category: "Boissons",
  },
  {
    id: "crazy-tiger",
    name: "Crazy Tiger",
    description: "Boisson énergisante.",
    price: 3.5,
    emoji: "⚡",
    category: "Boissons",
  },
  {
    id: "coca-cola-1-5l",
    name: "Coca-Cola 1,5 L",
    description: "Bouteille 1,5 L.",
    price: 4.5,
    emoji: "🧴",
    category: "Boissons",
  },
  {
    id: "oasis-1-5l",
    name: "Oasis 1,5 L",
    description: "Bouteille 1,5 L.",
    price: 4.5,
    emoji: "🧴",
    category: "Boissons",
  },
  {
    id: "jus-1-5l",
    name: "Jus de fruits 1,5 L",
    description: "Bouteille 1,5 L. Parfum à préciser.",
    price: 4.5,
    emoji: "🧃",
    category: "Boissons",
  },

  // Épicerie sucrée
  {
    id: "bonbons-traditionnels",
    name: "Bonbons traditionnels",
    description: "Assortiment de bonbons classiques.",
    price: 3.9,
    emoji: "🍬",
    category: "Épicerie sucrée",
  },
  {
    id: "fils-rouges",
    name: "Fils rouges",
    description: "Bonbons fils rouges.",
    price: 2.9,
    emoji: "🍬",
    category: "Épicerie sucrée",
  },
  {
    id: "bonbons-cola",
    name: "Bonbons Cola",
    description: "Bonbons goût cola.",
    price: 2.9,
    emoji: "🍬",
    category: "Épicerie sucrée",
  },
  {
    id: "chocolat-dubai",
    name: "Chocolat Dubaï",
    description: "Chocolat Dubaï.",
    price: 12.9,
    emoji: "🍫",
    category: "Épicerie sucrée",
  },
];
