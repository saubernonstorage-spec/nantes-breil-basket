import "server-only";

import nodemailer from "nodemailer";

/**
 * Envoi des formulaires par e-mail (SMTP), en plus de l'enregistrement dans l'Espace dirigeants.
 * À configurer dans les variables d'environnement de l'hébergeur (voir .env.example) :
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FORM_TO
 *   (+ FORM_FROM, FORM_TO_STAGES, FORM_TO_INSCRIPTIONS facultatifs)
 */

export type Destinataire = "general" | "stages" | "inscriptions";

function config() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FORM_TO, FORM_FROM, FORM_TO_STAGES, FORM_TO_INSCRIPTIONS } =
    process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !FORM_TO) return null;
  const port = Number(SMTP_PORT) || 587;
  return {
    transport: { host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } },
    from: FORM_FROM || SMTP_USER,
    to: { general: FORM_TO, stages: FORM_TO_STAGES || FORM_TO, inscriptions: FORM_TO_INSCRIPTIONS || FORM_TO },
  };
}

export function emailConfigure(): boolean {
  return config() !== null;
}

/** Supprime les retours à la ligne (en-têtes d'e-mail). */
function uneLigne(texte: string): string {
  return texte.replace(/[\r\n]+/g, " ").trim();
}

/** Renvoie true si le message est parti. */
export async function envoyerEmail({
  sujet,
  texte,
  repondreA,
  destinataire = "general",
}: {
  sujet: string;
  texte: string;
  repondreA?: string;
  destinataire?: Destinataire;
}): Promise<boolean> {
  const c = config();
  if (!c) {
    if (process.env.NODE_ENV !== "production") {
      // En local, sans configuration : on affiche le message dans le terminal pour tester le parcours.
      console.info(`\n[formulaire] SMTP non configuré — e-mail non envoyé.\nSujet : ${sujet}\n${texte}\n`);
    }
    return false;
  }
  try {
    await nodemailer.createTransport(c.transport).sendMail({
      from: `"Site du Nantes Breil Basket" <${c.from}>`,
      to: c.to[destinataire],
      replyTo: repondreA ? uneLigne(repondreA) : undefined,
      subject: uneLigne(sujet),
      text: texte,
    });
    return true;
  } catch (erreur) {
    console.error("[formulaire] Échec de l'envoi de l'e-mail :", erreur);
    return false;
  }
}
