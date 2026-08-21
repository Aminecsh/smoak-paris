import { ChichaBase, ChichaFlavor, ChichaSupplement } from "./types";
import { products } from "./products";

// Les deux chichas SMOAK proposées à la composition, façon Uber Eats :
// on choisit la base, puis on personnalise (goût, recharge, extras).
//
// ⚠️ Prix provisoires — à valider avant mise en vente.
export const chichaBases: ChichaBase[] = [
  {
    id: "quasar",
    name: "Quasar",
    description: "1 chicha Quasar, goût, charbon, briquet, embout plastique.",
    price: 24.9,
    emoji: "🌌",
  },
  {
    id: "khaloud",
    name: "Khaloud",
    description: "Notre chicha intense, pour les amateurs de saveurs corsées.",
    price: 24.9,
    emoji: "🔥",
  },
];

export const chichaFlavors: ChichaFlavor[] = [
  { id: "hawaii", name: "Hawaii", image: "/produits/Hawaii.png" },
  { id: "love-66", name: "Love 66", image: "/produits/Love66.png" },
  { id: "mi-amor", name: "Mi Amor", image: "/produits/MiAmor.png" },
  { id: "menthe", name: "Menthe", image: "/produits/Menthe.png" },
];

// Suppléments chicha — prix provisoires, à valider.
export const rechargeSupplement: ChichaSupplement & {
  description: string;
  image: string;
} = {
  id: "recharge",
  name: "Recharge",
  description: "Charbon, briquet et goût inclus.",
  price: 8.9,
  image: "/produits/Recharge.png",
};

export const charcoalSupplement: ChichaSupplement = {
  id: "charbon-supplement",
  name: "Charbon en plus",
  price: 2.9,
};

export const extraFlavorSupplement: ChichaSupplement = {
  id: "gout-supplement",
  name: "Goût supplémentaire",
  price: 3.9,
};

// Les boissons proposables en supplément dans le composeur : le même
// catalogue que la section Boissons de la carte, listées une par une.
export const drinkSupplements: ChichaSupplement[] = products
  .filter((p) => p.category === "Boissons")
  .map((p) => ({ id: p.id, name: p.name, price: p.price }));

// Les sucreries proposables en supplément, listées une par une.
export const sweetSupplements: ChichaSupplement[] = products
  .filter((p) => p.category === "Épicerie sucrée")
  .map((p) => ({ id: p.id, name: p.name, price: p.price }));
