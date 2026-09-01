import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, isOrderStatus } from "@/lib/orderStatus";
import { buildOrderStatusKeyboard } from "@/lib/notifications/telegram";

// Reçoit les clics sur les boutons de statut envoyés avec chaque commande
// (voir /lib/notifications/telegram). Toujours répondre 200 à Telegram —
// même en cas d'erreur applicative, sinon Telegram réessaie indéfiniment.
export async function POST(request: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const allowedChatIds = (process.env.TELEGRAM_CHAT_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (
    !botToken ||
    !webhookSecret ||
    request.headers.get("x-telegram-bot-api-secret-token") !== webhookSecret
  ) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let update: {
    callback_query?: {
      id: string;
      data?: string;
      message?: { chat?: { id?: number }; message_id?: number; text?: string };
    };
  };
  try {
    update = await request.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const callback = update.callback_query;
  if (!callback) {
    return NextResponse.json({ ok: true });
  }

  const chatId = String(callback.message?.chat?.id ?? "");
  const messageId = callback.message?.message_id;
  const messageText = callback.message?.text ?? "";

  const answerCallback = (text?: string) =>
    fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_query_id: callback.id, text }),
    }).catch(() => {});

  if (!allowedChatIds.includes(chatId)) {
    await answerCallback("Non autorisé");
    return NextResponse.json({ ok: true });
  }

  const [prefix, orderId, status] = (callback.data ?? "").split(":");
  if (prefix !== "status" || !orderId || !isOrderStatus(status)) {
    await answerCallback();
    return NextResponse.json({ ok: true });
  }

  const supabase = getSupabaseServerClient();

  // Un autre cofondateur a peut-être déjà fait avancer le statut depuis un
  // autre chat entre-temps : on ne laisse jamais un bouton périmé faire
  // reculer la commande, et on resynchronise tous les messages sur l'état
  // réel (pas seulement celui sur lequel on vient de cliquer).
  const { data: existing } = await supabase
    .from("orders")
    .select("status, telegram_message_ids")
    .eq("id", orderId)
    .single<{ status: string; telegram_message_ids: Record<string, number> | null }>();

  if (!existing) {
    await answerCallback("Commande introuvable");
    return NextResponse.json({ ok: true });
  }

  const currentIndex = isOrderStatus(existing.status) ? ORDER_STATUSES.indexOf(existing.status) : -1;
  const targetIndex = ORDER_STATUSES.indexOf(status);

  let finalStatus = status;
  if (currentIndex >= targetIndex) {
    finalStatus = isOrderStatus(existing.status) ? existing.status : status;
    await answerCallback(
      currentIndex > targetIndex
        ? `Déjà à une étape ultérieure : ${ORDER_STATUS_LABELS[finalStatus]}`
        : undefined,
    );
  } else {
    const { error } = await supabase
      .from("orders")
      .update({ status: finalStatus })
      .eq("id", orderId);
    if (error) {
      await answerCallback("Erreur, réessaie");
      return NextResponse.json({ ok: true });
    }
    await answerCallback(`Statut mis à jour : ${ORDER_STATUS_LABELS[finalStatus]}`);

    // Le partage de position en direct passe par le site (accès GPS du
    // téléphone, impossible depuis un simple bouton Telegram) — on envoie
    // le lien direct à la personne qui vient de se mettre en livraison.
    if (finalStatus === "en_livraison" && chatId) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `📍 Ouvre ce lien pour partager ta position en direct avec le client :\n${request.nextUrl.origin}/livreur/${orderId}`,
        }),
      }).catch(() => {});
    }
  }

  // Édite le message dans tous les chats connus pour cette commande (pas
  // seulement celui d'où vient le clic), pour que les autres cofondateurs
  // voient le statut avancer aussi. Le message qui a reçu le clic est
  // toujours inclus, même s'il manquait de la table (défensif).
  const messageIds: Record<string, number> = { ...(existing.telegram_message_ids ?? {}) };
  if (messageId && chatId) {
    messageIds[chatId] = messageId;
  }

  const newText = `${messageText}\n\n✅ ${ORDER_STATUS_LABELS[finalStatus]}`;
  const newKeyboard = buildOrderStatusKeyboard(orderId, finalStatus);

  await Promise.all(
    Object.entries(messageIds).map(([cid, mid]) =>
      fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: cid,
          message_id: mid,
          text: newText,
          reply_markup: newKeyboard,
        }),
      }).catch(() => {}),
    ),
  );

  return NextResponse.json({ ok: true });
}
