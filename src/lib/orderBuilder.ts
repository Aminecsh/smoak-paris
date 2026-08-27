import { products } from "@/lib/products";
import {
  chichaBases,
  chichaFlavors,
  rechargeSupplement,
  drinkSupplements,
  sweetSupplements,
} from "@/lib/chicha";

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface ConfiguredChichaInput {
  chichaId: string;
  flavorId: string;
  secondFlavorId?: string;
  recharge?: boolean;
  drinkIds?: string[];
  sweetIds?: string[];
  quantity: number;
}

export interface OrderItemRow {
  kind: "produit" | "chicha";
  name: string;
  unit_price: number;
  quantity: number;
  details: Record<string, unknown> | null;
}

export interface StockDecrement {
  id: string;
  name: string;
  quantity: number;
}

export interface BuiltOrder {
  itemRows: OrderItemRow[];
  stockDecrements: StockDecrement[];
}

function isPositiveInt(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

// Reconstruit les lignes de commande et les décomptes de stock à partir du
// catalogue serveur — on ne fait jamais confiance aux prix envoyés par le
// client. Utilisé à la fois pour créer une commande et pour y ajouter des
// articles a posteriori.
export function buildOrder(payload: {
  items: OrderItemInput[];
  configuredChichas: ConfiguredChichaInput[];
}): BuiltOrder | { error: string } {
  const itemRows: OrderItemRow[] = [];
  const stockDecrements: StockDecrement[] = [];

  for (const item of payload.items ?? []) {
    if (!isPositiveInt(item.quantity)) {
      return { error: `Quantité invalide pour ${item.productId}` };
    }
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return { error: `Produit inconnu : ${item.productId}` };
    }
    itemRows.push({
      kind: "produit",
      name: product.name,
      unit_price: product.price,
      quantity: item.quantity,
      details: null,
    });
    stockDecrements.push({
      id: product.id,
      name: product.name,
      quantity: item.quantity,
    });
  }

  for (const chicha of payload.configuredChichas ?? []) {
    if (!isPositiveInt(chicha.quantity)) {
      return { error: "Quantité de chicha invalide" };
    }
    const base = chichaBases.find((c) => c.id === chicha.chichaId);
    if (!base) {
      return { error: `Chicha inconnue : ${chicha.chichaId}` };
    }
    const flavor = chichaFlavors.find((f) => f.id === chicha.flavorId);
    if (!flavor) {
      return { error: `Goût inconnu : ${chicha.flavorId}` };
    }
    const secondFlavor = chicha.secondFlavorId
      ? chichaFlavors.find((f) => f.id === chicha.secondFlavorId)
      : null;
    if (chicha.secondFlavorId && !secondFlavor) {
      return { error: `Goût inconnu : ${chicha.secondFlavorId}` };
    }
    const drinks = (chicha.drinkIds ?? []).map((id) =>
      drinkSupplements.find((d) => d.id === id),
    );
    if (drinks.some((d) => !d)) {
      return { error: "Boisson en supplément inconnue" };
    }
    const sweets = (chicha.sweetIds ?? []).map((id) =>
      sweetSupplements.find((s) => s.id === id),
    );
    if (sweets.some((s) => !s)) {
      return { error: "Sucrerie en supplément inconnue" };
    }

    const unitPrice =
      base.price +
      (chicha.recharge ? rechargeSupplement.price : 0) +
      drinks.reduce((sum, d) => sum + (d?.price ?? 0), 0) +
      sweets.reduce((sum, s) => sum + (s?.price ?? 0), 0);

    itemRows.push({
      kind: "chicha",
      name: secondFlavor
        ? `${base.name} — ${flavor.name} + ${secondFlavor.name}`
        : `${base.name} — ${flavor.name}`,
      unit_price: unitPrice,
      quantity: chicha.quantity,
      details: {
        flavor: flavor.name,
        secondFlavor: secondFlavor?.name ?? null,
        recharge: Boolean(chicha.recharge),
        drinks: drinks.map((d) => d!.name),
        sweets: sweets.map((s) => s!.name),
      },
    });

    stockDecrements.push({ id: base.id, name: base.name, quantity: chicha.quantity });
    stockDecrements.push({ id: flavor.id, name: flavor.name, quantity: chicha.quantity });
    if (secondFlavor) {
      stockDecrements.push({
        id: secondFlavor.id,
        name: secondFlavor.name,
        quantity: chicha.quantity,
      });
    }
    if (chicha.recharge) {
      stockDecrements.push({
        id: rechargeSupplement.id,
        name: rechargeSupplement.name,
        quantity: chicha.quantity,
      });
    }
    for (const drink of drinks) {
      stockDecrements.push({
        id: drink!.id,
        name: drink!.name,
        quantity: chicha.quantity,
      });
    }
    for (const sweet of sweets) {
      stockDecrements.push({
        id: sweet!.id,
        name: sweet!.name,
        quantity: chicha.quantity,
      });
    }
  }

  if (itemRows.length === 0) {
    return { error: "Le panier est vide" };
  }

  return { itemRows, stockDecrements };
}
