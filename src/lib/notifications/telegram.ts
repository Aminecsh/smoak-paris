import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/orderStatus";

// Envoi de notifications à l'équipe (nouvelle commande) via l'API Telegram
// Bot (appel REST direct, pas de SDK). Nécessite TELEGRAM_BOT_TOKEN et
// TELEGRAM_CHAT_IDS (un ou plusieurs chat_id séparés par des virgules — un
// par livreur ou un groupe). Ne lève jamais : une notif ratée ne doit pas
// faire échouer la commande.

interface InlineKeyboard {
  inline_keyboard: { text: string; callback_data: string }[][];
}

interface TelegramSendResult {
  chatId: string;
  ok: boolean;
  messageId?: number;
  error?: string;
}

// Construit les boutons "étape suivante" pour une commande donnée, à partir
// de son statut actuel — un bouton par statut restant, dans l'ordre.
// Retourne undefined une fois la commande livrée (plus rien à proposer).
export function buildOrderStatusKeyboard(
  orderId: string,
  currentStatus: OrderStatus,
): InlineKeyboard | undefined {
  const nextStatuses = ORDER_STATUSES.slice(ORDER_STATUSES.indexOf(currentStatus) + 1);
  if (nextStatuses.length === 0) return undefined;

  return {
    inline_keyboard: nextStatuses.map((status) => [
      { text: ORDER_STATUS_LABELS[status], callback_data: `status:${orderId}:${status}` },
    ]),
  };
}

export async function sendTelegramMessage(
  text: string,
  options?: { replyMarkup?: InlineKeyboard },
): Promise<TelegramSendResult[]> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = process.env.TELEGRAM_CHAT_IDS;

  if (!botToken || !chatIds) return [];

  const ids = chatIds
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return Promise.all(
    ids.map(async (chatId): Promise<TelegramSendResult> => {
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
              reply_markup: options?.replyMarkup,
            }),
            signal: AbortSignal.timeout(10000),
          },
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return { chatId, ok: false, error: data.description ?? `Telegram HTTP ${res.status}` };
        }
        return { chatId, ok: true, messageId: data.result?.message_id };
      } catch (err) {
        return {
          chatId,
          ok: false,
          error: err instanceof Error ? err.message : "Erreur inconnue",
        };
      }
    }),
  );
}
