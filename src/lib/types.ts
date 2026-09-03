export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  category: string;
  image?: string;
}

export interface ChichaBase {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  image?: string;
  // Nombre de chichas incluses dans ce pack (1, 2 ou 3) — chacune avec son
  // propre goût au choix dans le composeur (voir ChichaConfiguratorModal).
  chichaCount: number;
}

export interface ChichaFlavor {
  id: string;
  name: string;
  image: string;
}

export interface ChichaSupplement {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export interface ChichaSupplementLine {
  id: string;
  name: string;
  price: number;
}

// Une chicha configurée par le client : goût, options et suppléments
// choisis dans le composeur, avant d'être ajoutée au panier comme une
// ligne à part.
export interface ConfiguredChichaItem {
  id: string;
  chichaId: string;
  chichaName: string;
  chichaEmoji: string;
  flavorId: string;
  flavorName: string;
  // Pack Duo uniquement : goût de la seconde chicha.
  secondFlavorId?: string;
  secondFlavorName?: string;
  // Pack Trio uniquement : goût de la troisième chicha.
  thirdFlavorId?: string;
  thirdFlavorName?: string;
  recharge: boolean;
  drinks: ChichaSupplementLine[];
  sweets: ChichaSupplementLine[];
  unitPrice: number;
  quantity: number;
}
