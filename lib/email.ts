import "server-only";

import nodemailer from "nodemailer";
import { EMAIL_EXPEDITEUR, EMAILS_SERVICES } from "@/data/nbb";
import type { ServiceEmail } from "@/lib/types";

/**
 * Envoi des e-mails du site (SMTP, Brevo) : notifications au service concerné de l'association, accusés de
 * réception et confirmations d'inscription aux stages envoyés aux familles.
 * - Expéditeur unique : EMAIL_EXPEDITEUR (data/nbb.ts) ; les anciennes variables FORM_FROM et FORM_TO* sont ignorées.
 * - Destinataires : EMAILS_SERVICES (data/nbb.ts), un service par type de demande.
 * Variables d'environnement de l'hébergeur (voir .env.example) : SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.
 */

function config() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT) || 587;
  return {
    transport: { host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } },
    from: EMAIL_EXPEDITEUR,
  };
}

export function emailConfigure(): boolean {
  return config() !== null;
}

/** Adresse(s) d'un service ; un service sans adresse renvoie vers contact. */
export function adresseService(service: ServiceEmail): string {
  return EMAILS_SERVICES[service]?.trim() || EMAILS_SERVICES.contact;
}

/** Supprime les retours à la ligne (en-têtes d'e-mail). */
function uneLigne(texte: string): string {
  return texte.replace(/[\r\n]+/g, " ").trim();
}

/** Résultat d'un envoi à une personne : « simule » = en local sans messagerie (message affiché dans le terminal). */
export type Envoi = "envoye" | "simule" | "echec" | "non-configure";

/**
 * E-mail à une personne (accusé de réception, confirmation d'inscription au parent). « Répondre » renvoie
 * vers le service ; copieService ajoute une copie cachée à ce service pour garder une trace.
 */
export async function envoyerEmailA({
  a,
  sujet,
  texte,
  service,
  copieService = false,
}: {
  a: string;
  sujet: string;
  texte: string;
  service: ServiceEmail;
  copieService?: boolean;
}): Promise<Envoi> {
  const c = config();
  if (!c) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`\n[confirmation] Messagerie non configurée : e-mail simulé, rien n'est envoyé.\nDe : ${EMAIL_EXPEDITEUR} (réponses : ${adresseService(service)})\nÀ : ${a}\nObjet : ${sujet}\n\n${texte}\n`);
      return "simule";
    }
    return "non-configure";
  }
  try {
    await nodemailer.createTransport(c.transport).sendMail({
      from: `"Nantes Breil Basket" <${c.from}>`,
      to: uneLigne(a),
      bcc: copieService ? adresseService(service) : undefined,
      replyTo: adresseService(service),
      subject: uneLigne(sujet),
      text: texte,
    });
    return "envoye";
  } catch (erreur) {
    console.error("[confirmation] Échec de l'envoi de l'e-mail :", erreur);
    return "echec";
  }
}

/** Notification au service concerné ; « Répondre » écrit à la personne (repondreA). Renvoie true si le message est parti. */
export async function envoyerEmail({
  sujet,
  texte,
  repondreA,
  service = "contact",
}: {
  sujet: string;
  texte: string;
  repondreA?: string;
  service?: ServiceEmail;
}): Promise<boolean> {
  const c = config();
  if (!c) {
    if (process.env.NODE_ENV !== "production") {
      // En local, sans configuration : on affiche le message dans le terminal pour tester le parcours.
      console.info(`\n[formulaire] SMTP non configuré — e-mail non envoyé.\nÀ : ${adresseService(service)}\nSujet : ${sujet}\n${texte}\n`);
    }
    return false;
  }
  try {
    await nodemailer.createTransport(c.transport).sendMail({
      from: `"Site du Nantes Breil Basket" <${c.from}>`,
      to: adresseService(service),
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
