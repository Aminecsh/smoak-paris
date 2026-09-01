// Templates d'email — HTML "email-safe" (styles inline, mise en page par
// tables) pour un rendu correct sur Gmail, Outlook, Apple Mail, etc. Le logo
// est chargé depuis le site en prod (les clients mail ne peuvent pas lire de
// fichiers locaux).
const LOGO_URL = "https://www.smoakparis.com/logo.png";
const INK = "#111111";
const MUTED = "#8a8a85";
const BORDER = "#e5e3de";
const BACKGROUND = "#fafaf8";

function emailShell(bodyHtml: string): string {
  return `
<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:0;background:${BACKGROUND};font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BACKGROUND};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#ffffff;border:1px solid ${BORDER};border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 24px;text-align:center;border-bottom:1px solid ${BORDER};">
                <img src="${LOGO_URL}" alt="Smoak Paris" width="140" style="display:inline-block;width:140px;height:auto;" />
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:${BACKGROUND};border-top:1px solid ${BORDER};text-align:center;">
                <p style="margin:0;font-size:11px;color:${MUTED};">
                  Smoak Paris — Chicha premium livrée à Paris et en Île-de-France
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`.trim();
}

export function renderTrackingEmail(params: { firstName: string; trackingUrl: string }): string {
  const { firstName, trackingUrl } = params;
  return emailShell(`
    <p style="margin:0 0 4px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${MUTED};">
      Commande confirmée
    </p>
    <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;color:${INK};">
      Bonjour ${firstName} 👋
    </h1>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:${INK};">
      Votre commande est en préparation. Suivez sa progression et la
      position de votre livreur en temps réel via le lien ci-dessous.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td style="border-radius:8px;background:${INK};">
          <a href="${trackingUrl}" style="display:inline-block;padding:14px 28px;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;">
            Suivre ma commande →
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:${MUTED};">
      Le bouton ne fonctionne pas ? Copie ce lien dans ton navigateur :<br />
      <a href="${trackingUrl}" style="color:${MUTED};">${trackingUrl}</a>
    </p>
  `);
}
