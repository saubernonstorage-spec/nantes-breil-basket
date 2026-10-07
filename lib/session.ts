import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Accès à l'Espace dirigeants : un mot de passe partagé par le bureau, défini dans la
 * variable d'environnement ADMIN_PASSWORD (hPanel Hostinger → application Node.js → variables d'environnement).
 * Une fois connecté, un cookie signé garde la session ouverte 12 heures.
 * Changer le mot de passe déconnecte tout le monde.
 */

const COOKIE = "nbb_dirigeants";
const DUREE_S = 12 * 60 * 60;

function cle(): Buffer | null {
  const motDePasse = process.env.ADMIN_PASSWORD;
  if (!motDePasse) return null;
  return createHash("sha256")
    .update(`nbb-espace-dirigeants:${motDePasse}:${process.env.ADMIN_SECRET ?? ""}`)
    .digest();
}

function signer(expiration: number, k: Buffer): string {
  return createHmac("sha256", k).update(String(expiration)).digest("base64url");
}

function egal(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function accesConfigure(): boolean {
  return cle() !== null;
}

export function motDePasseValide(saisi: string): boolean {
  const attendu = process.env.ADMIN_PASSWORD;
  return !!attendu && egal(saisi, attendu);
}

export async function estConnecte(): Promise<boolean> {
  const k = cle();
  if (!k) return false;
  const valeur = (await cookies()).get(COOKIE)?.value ?? "";
  const [exp, signature] = valeur.split(".");
  const expiration = Number(exp);
  if (!expiration || !signature || expiration < Date.now() / 1000) return false;
  return egal(signature, signer(expiration, k));
}

export async function ouvrirSession() {
  const k = cle();
  if (!k) return;
  const expiration = Math.floor(Date.now() / 1000) + DUREE_S;
  (await cookies()).set(COOKIE, `${expiration}.${signer(expiration, k)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DUREE_S,
  });
}

export async function fermerSession() {
  (await cookies()).delete(COOKIE);
}
