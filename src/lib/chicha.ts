import { ChichaBase, ChichaFlavor, ChichaSupplement } from "./types";
import { products } from "./products";

// Les chichas SMOAK proposées à la composition, façon Uber Eats : on
// choisit la base, puis on personnalise (goût, recharge, extras).
//
// Cohérence des tarifs (base = Chicha Quasar à 30€) :
// - Pack Chicha Sucré = chicha + 1 boisson (~2€) + 1 bonbon (~2,90-3,90€)
//   inclus, valeur à l'unité ~35-36€ → pack à 35€ (léger avantage).
// - Pack Duo = 2 chichas complètes (2×30€ = 60€ à l'unité) → pack à 55€
//   (avantage duo de 5€).
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
