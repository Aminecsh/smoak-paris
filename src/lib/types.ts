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
  // Pack "compose ta soirée" : une boisson et une sucrerie au choix sont
  // incluses dans le prix, sans supplément (voir ChichaConfiguratorModal).
  isPack?: boolean;
  // Pack Duo : deux chichas complètes, chacune avec son propre goût au
  // choix (voir ChichaConfiguratorModal).
  isDuo?: boolean;
  // Pack Soirée : trois chichas complètes, chacune avec son propre goût,
  // sa boisson et son bonbon au choix (voir ChichaConfiguratorModal).
  isSoiree?: boolean;
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
  // Pack Soirée uniquement : goût de la troisième chicha.
  thirdFlavorId?: string;
  thirdFlavorName?: string;
  recharge: boolean;
  drinks: ChichaSupplementLine[];
  sweets: ChichaSupplementLine[];
  unitPrice: number;
  quantity: number;
}
