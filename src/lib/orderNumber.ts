// Référence affichée au client/livreur à la place du numéro de commande brut
// — évite qu'on puisse déduire le volume total de commandes en observant la
// suite des numéros.
export function formatOrderReference(orderNumber: number): string {
  return `SM10${String(orderNumber).padStart(3, "0")}5`;
}
