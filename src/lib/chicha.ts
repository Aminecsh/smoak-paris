import { ChichaBase, ChichaFlavor, ChichaSupplement } from "./types";
import { products } from "./products";

// Les chichas SMOAK proposées à la composition, façon Uber Eats : on
// choisit un pack (1, 2 ou 3 chichas), puis on choisit le goût de chacune.
// Prix par palier, dégressif sur le nombre de chichas : 40€ / 70€ / 100€.
export const chichaBases: ChichaBase[] = [
  {
    id: "quasar",
    name: "Chicha Quasar",
    description: "Une chicha Quasar, prête à fumer.",
    price: 40,
    emoji: "🌌",
    image: "/produits/chicha-quasar.jpg",
    chichaCount: 1,
  },
  {
    id: "pack-duo",
    name: "Pack Duo",
    description: "Deux chichas Quasar, chacune avec son goût au choix.",
    price: 70,
    emoji: "",
    image: "/produits/pack-duo.jpg",
    chichaCount: 2,
  },
  {
    id: "pack-soiree",
    name: "Pack Trio",
    description: "Trois chichas Quasar, chacune avec son goût au choix.",
    price: 100,
    emoji: "",
    image: "/produits/pack-duo.jpg",
    chichaCount: 3,
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
  name: "Tête en plus",
  description: "Charbon, briquet et goût inclus.",
  price: 10,
  image: "/produits/Recharge.png",
};

// Les boissons proposables en supplément dans le composeur : le même
// catalogue que la section Boissons de la carte, listées une par une.
export const drinkSupplements: ChichaSupplement[] = products
  .filter((p) => p.category === "Boissons")
  .map((p) => ({ id: p.id, name: p.name, price: p.price, image: p.image }));

// Les sucreries proposables en supplément, listées une par une.
export const sweetSupplements: ChichaSupplement[] = products
  .filter((p) => p.category === "Épicerie sucrée")
  .map((p) => ({ id: p.id, name: p.name, price: p.price, image: p.image }));

// Prix "standard" de référence pour une boisson/sucrerie (canette classique,
// sachet Fini) — sert de base au calcul de supplément si jamais une
// boisson/sucrerie est incluse dans une configuration (utilisé par
// orderBuilder, plus par le composeur actuel qui vend les chichas seules).
export const INCLUDED_DRINK_PRICE = 2;
export const INCLUDED_SWEET_PRICE = 3;

function surcharge(price: number, includedPrice: number): number {
  return Math.max(0, Math.round((price - includedPrice) * 100) / 100);
}

export function drinkSurcharge(drink: ChichaSupplement): number {
  return surcharge(drink.price, INCLUDED_DRINK_PRICE);
}

export function sweetSurcharge(sweet: ChichaSupplement): number {
  return surcharge(sweet.price, INCLUDED_SWEET_PRICE);
}

// Un pack n'est pas une référence physique séparée : c'est un bundle de
// chichas "Quasar" (le seul modèle physique en stock). Le stock à décrémenter
// est donc toujours celui de "quasar", multiplié par chichaCount.
export const PHYSICAL_CHICHA_ID = "quasar";
export const PHYSICAL_CHICHA_NAME = "Chicha Quasar";

export function physicalChichaCount(base: ChichaBase): number {
  return base.chichaCount;
}
