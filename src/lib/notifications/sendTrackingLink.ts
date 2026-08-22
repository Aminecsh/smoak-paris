import { sendWhatsAppMessage } from "./whatsapp";
import { sendEmail } from "./email";

export type NotificationChannel = "whatsapp" | "email" | "failed";

// Envoie le lien de suivi par WhatsApp (numéro fourni par le client) et, en
// cas d'échec (pas de WhatsApp, numéro invalide, Twilio non configuré...),
// retombe sur l'email. Ne lève jamais — la commande doit être créée même si
// aucun canal de notification n'aboutit.
export async function sendTrackingLink(params: {
  firstName: string;
  phone: string;
  email: string;
  trackingUrl: string;
}): Promise<{ channel: NotificationChannel; error?: string }> {
  const { firstName, phone, email, trackingUrl } = params;
  const phoneE164 = phone.replace(/\s+/g, "");

  const message = `Bonjour ${firstName}, voici le lien pour suivre votre commande Smoak Paris : ${trackingUrl}`;

  const whatsapp = await sendWhatsAppMessage(phoneE164, message);
  if (whatsapp.ok) {
    return { channel: "whatsapp" };
  }

  const emailResult = await sendEmail(
    email,
    "Suivez votre commande Smoak Paris",
    `<p>Bonjour ${firstName},</p><p>Voici le lien pour suivre votre commande Smoak Paris :</p><p><a href="${trackingUrl}">${trackingUrl}</a></p>`,
  );
  if (emailResult.ok) {
    return { channel: "email", error: whatsapp.error };
  }

  return { channel: "failed", error: `WhatsApp: ${whatsapp.error} / Email: ${emailResult.error}` };
}
