// Liste canonique des statuts de commande, dans l'ordre du flux — utilisée
// par la vue livreur, l'API de mise à jour de statut et les boutons
// Telegram, pour ne jamais diverger sur les valeurs ou libellés.
export const ORDER_STATUSES = [
  "recue",
  "en_preparation",
  "en_livraison",
  "livree",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  recue: "Reçue",
  en_preparation: "En préparation",
  en_livraison: "En livraison",
  livree: "Livrée",
};

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (ORDER_STATUSES as readonly string[]).includes(value);
}
