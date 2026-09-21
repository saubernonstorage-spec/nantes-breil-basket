import nodemailer from "nodemailer";

/**
 * Envoi des formulaires par e-mail (SMTP).
 * À configurer dans les variables d'environnement de l'hébergeur (voir .env.example) :
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FORM_TO (+ FORM_FROM, FORM_TO_STAGES facultatifs)
 */

type Resultat = { ok: true } | { ok: false; message: string };

function config() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FORM_TO, FORM_FROM, FORM_TO_STAGES } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !FORM_TO) return null;
  const port = Number(SMTP_PORT) || 587;
  return {
    transport: { host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } },
    from: FORM_FROM || SMTP_USER,
    to: FORM_TO,
    toStages: FORM_TO_STAGES || FORM_TO,
  };
}

/** Supprime les retours à la ligne (en-têtes d'e-mail). */
function uneLigne(texte: string): string {
  return texte.replace(/[\r\n]+/g, " ").trim();
}

export async function envoyerEmail({
  sujet,
  texte,
  repondreA,
  destinataire = "general",
}: {
  sujet: string;
  texte: string;
  repondreA?: string;
  destinataire?: "general" | "stages";
}): Promise<Resultat> {
  const c = config();

  if (!c) {
    if (process.env.NODE_ENV !== "production") {
      // En local, sans configuration : on affiche le message dans le terminal pour tester le parcours.
      console.info(`\n[formulaire] SMTP non configuré — message NON envoyé.\nSujet : ${sujet}\n${texte}\n`);
      return { ok: true };
    }
    console.error("[formulaire] SMTP non configuré : définissez SMTP_HOST, SMTP_USER, SMTP_PASS et FORM_TO.");
    return {
      ok: false,
      message:
        "L'envoi en ligne n'est pas encore activé. Écrivez-nous directement par e-mail ou via le groupe WhatsApp du club.",
    };
  }

  try {
    const transporteur = nodemailer.createTransport(c.transport);
    await transporteur.sendMail({
      from: `"Site du Nantes Breil Basket" <${c.from}>`,
      to: destinataire === "stages" ? c.toStages : c.to,
      replyTo: repondreA ? uneLigne(repondreA) : undefined,
      subject: uneLigne(sujet),
      text: texte,
    });
    return { ok: true };
  } catch (erreur) {
    console.error("[formulaire] Échec de l'envoi :", erreur);
    return {
      ok: false,
      message: "L'envoi a échoué. Réessayez dans quelques minutes ou écrivez-nous directement par e-mail.",
    };
  }
}
