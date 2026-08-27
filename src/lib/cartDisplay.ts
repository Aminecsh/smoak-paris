// Les boissons/sucreries d'une chicha sont stockées en lignes répétées (une
// entrée par unité) — on les regroupe ici pour l'affichage ("2× Coca-Cola"
// plutôt que deux lignes identiques).
export function groupSupplementLines(lines: { id: string; name: string }[]) {
  const grouped = new Map<string, { name: string; quantity: number }>();
  for (const line of lines) {
    const existing = grouped.get(line.id);
    if (existing) existing.quantity += 1;
    else grouped.set(line.id, { name: line.name, quantity: 1 });
  }
  return Array.from(grouped.entries()).map(([id, value]) => ({ id, ...value }));
}
