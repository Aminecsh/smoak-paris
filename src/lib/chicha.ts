import { ChichaBase, ChichaFlavor, ChichaSupplement } from "./types";
import { products } from "./products";

// Les chichas SMOAK proposées à la composition, façon Uber Eats : on
// choisit la base, puis on personnalise (goût, recharge, extras).
//
// Cohérence des tarifs (base = Chicha Quasar à 30€) :
// - Pack Chicha Sucré = chicha + 1 boisson standard (2€) + 1 bonbon
//   standard (2,90€) inclus → pack à 35€. Une boisson/bonbon plus cher
//   (Red Bull, format 1L5, Popcorn Caramel...) ajoute la différence de
//   prix en supplément (voir drinkSurcharge / sweetSurcharge).
// - Pack Duo = 2 chichas complètes (2×30€ = 60€ à l'unité) → pack à 55€
//   (avantage duo de 5€).
// - Pack Soirée = 3 chichas + 3 boissons + 3 bonbons standard inclus
//   (valeur à l'unité ~90€ de chichas + ~15€ de boissons/bonbons) → pack
//   à 95€, mêmes suppléments que le Pack Chicha Sucré au-delà du standard.
export const chichaBases: ChichaBase[] = [
  {
    id: "quasar",
    name: "Chicha Quasar",
    description: "Une chicha complète, prête à fumer.",
    price: 30,
    emoji: "🌌",
    image: "/produits/chicha-quasar.jpg",
  },
  {
    id: "pack-chicha-sucre",
    name: "Pack Chicha Sucré",
    description: "Une chicha + une boisson + un bonbon au choix, en pack.",
    price: 35,
    emoji: "",
    image: "/produits/pack-zahma.jpg",
    isPack: true,
  },
  {
    id: "pack-duo",
    name: "Pack Duo",
    description: "Deux chichas complètes, chacune avec son goût au choix.",
    price: 55,
    emoji: "",
    image: "/produits/pack-duo.jpg",
    isDuo: true,
  },
  {
    id: "pack-soiree",
    name: "Pack Soirée",
    description: "Trois chichas complètes, chacune avec son goût, sa boisson et son bonbon au choix.",
    price: 95,
    emoji: "",
    image: "/produits/pack-soiree.jpg",
    isSoiree: true,
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
  price: 15,
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

// Prix "standard" d'une boisson/sucrerie incluse gratuitement dans un pack
// (canette classique, sachet Fini). Au-delà, la différence avec le prix
// catalogue réel est facturée en supplément (ex : Red Bull, formats 1L5,
// Popcorn Caramel) — cohérent quel que soit le produit choisi.
export const INCLUDED_DRINK_PRICE = 2;
export const INCLUDED_SWEET_PRICE = 2.9;

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
// est donc toujours celui de "quasar", multiplié par le nombre de chichas
// que la configuration utilise réellement (1 pour une chicha seule ou le
// Pack Chicha Sucré, 2 pour le Duo, 3 pour la Soirée).
export const PHYSICAL_CHICHA_ID = "quasar";
export const PHYSICAL_CHICHA_NAME = "Chicha Quasar";

export function physicalChichaCount(base: ChichaBase): number {
  if (base.isSoiree) return 3;
  if (base.isDuo) return 2;
  return 1;
}
