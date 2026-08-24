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
  recharge: boolean;
  extraCharcoal: boolean;
  drinks: ChichaSupplementLine[];
  sweets: ChichaSupplementLine[];
  unitPrice: number;
  quantity: number;
}
