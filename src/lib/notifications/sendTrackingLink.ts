import { sendEmail } from "./email";

export type NotificationChannel = "email" | "failed";

// Envoie le lien de suivi par email. Ne lève jamais — la commande doit être
// créée même si l'envoi échoue.
export async function sendTrackingLink(params: {
  firstName: string;
  phone: string;
  email: string;
  trackingUrl: string;
}): Promise<{ channel: NotificationChannel; error?: string }> {
  const { firstName, email, trackingUrl } = params;

  const emailResult = await sendEmail(
    email,
    "Suivez votre commande Smoak Paris",
    `<p>Bonjour ${firstName},</p><p>Voici le lien pour suivre votre commande Smoak Paris :</p><p><a href="${trackingUrl}">${trackingUrl}</a></p>`,
  );
  if (emailResult.ok) {
    return { channel: "email" };
  }

  return { channel: "failed", error: emailResult.error };
}
