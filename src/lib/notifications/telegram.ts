// Envoi de notifications à l'équipe (nouvelle commande) via l'API Telegram
// Bot (appel REST direct, pas de SDK). Nécessite TELEGRAM_BOT_TOKEN et
// TELEGRAM_CHAT_IDS (un ou plusieurs chat_id séparés par des virgules — un
// par livreur ou un groupe). Ne lève jamais : une notif ratée ne doit pas
// faire échouer la commande.
export async function sendTelegramMessage(
  text: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = process.env.TELEGRAM_CHAT_IDS;

  if (!botToken || !chatIds) {
    return { ok: false, error: "Telegram non configuré" };
  }

  const ids = chatIds
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const results = await Promise.all(
    ids.map(async (chatId) => {
      try {
        const res = await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text,
              disable_web_page_preview: true,
            }),
            signal: AbortSignal.timeout(10000),
          },
        );
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          return { ok: false as const, error: data.description ?? `Telegram HTTP ${res.status}` };
        }
        return { ok: true as const };
      } catch (err) {
        return {
          ok: false as const,
          error: err instanceof Error ? err.message : "Erreur inconnue",
        };
      }
    }),
  );

  const failed = results.filter((r) => !r.ok);
  if (failed.length === results.length) {
    return { ok: false, error: failed[0]?.error ?? "Échec de l'envoi Telegram" };
  }
  return { ok: true };
}
