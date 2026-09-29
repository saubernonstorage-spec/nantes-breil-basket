import type { Metadata } from "next";
import Link from "next/link";
import { CLUB, MENTIONS } from "@/data/nbb";
import { aCompleter } from "@/lib/utils";
import { BoutonCookies } from "@/components/Cookies";
import { FilAriane } from "@/components/Page";

export const metadata: Metadata = {
  title: "Mentions légales et confidentialité",
  description: "Mentions légales, politique de confidentialité, cookies et droit à l'image du site du Nantes Breil Basket.",
  alternates: { canonical: "/mentions-legales" },
};

export default function Mentions() {
  return (
    <>
      <section className="entete-page">
        <div className="entete-page__inner" style={{ maxWidth: 900 }}>
          <FilAriane page="Informations légales" />
          <h1 className="titre-page" style={{ margin: 0 }}>
            Mentions légales <span className="accent">&amp; confidentialité</span>
          </h1>
        </div>
      </section>
      <div className="mentions">
        <section className="mentions__bloc">
          <h2>Éditeur du site</h2>
          <p>
            {CLUB.nom}, association loi 1901. Siège :
            {CLUB.adresse.split("\n").map((l) => (
              <span key={l}>
                <br />
                {l}
              </span>
            ))}
            <br />
            {/* Chaque information n'apparaît qu'une fois renseignée dans data/nbb.ts (sans « [À COMPLÉTER] »). */}
            {aCompleter(MENTIONS.rna) ? null : <>Numéro RNA : {MENTIONS.rna}. </>}
            {aCompleter(MENTIONS.siret) ? null : <>SIRET : {MENTIONS.siret}. </>}
            {aCompleter(MENTIONS.responsablePublication) ? null : (
              <>Responsable de la publication : {MENTIONS.responsablePublication}. </>
            )}
            Contact : <a href={`mailto:${CLUB.email}`}>{CLUB.email}</a>.
          </p>
        </section>
        <section className="mentions__bloc">
          <h2>Hébergement</h2>
          <p>{MENTIONS.hebergeur}</p>
        </section>
        <section id="confidentialite" className="mentions__bloc">
          <h2>Données personnelles</h2>
          <p>
            Le club collecte uniquement les données nécessaires : formulaires d'inscription, de stage et de contact.
            Finalités : gestion des adhésions et de la licence FFBB, organisation des stages, réponse à vos messages. Base
            légale : l'exécution de l'adhésion et votre consentement.
          </p>
          <p>
            Les demandes envoyées depuis le site sont conservées dans un espace réservé aux dirigeants du club, protégé
            par mot de passe et hébergé par Netlify dans l'Union européenne (Francfort) ; elles peuvent aussi être
            transmises par e-mail à la messagerie du club.
          </p>
          <p>
            Destinataires : les membres du bureau et des commissions concernées, et la FFBB pour la licence. Les données
            ne sont ni vendues ni utilisées à des fins publicitaires.
            {aCompleter(MENTIONS.conservationAdhesions) ? null : (
              <> Durée de conservation des adhésions : la saison en cours plus {MENTIONS.conservationAdhesions}.</>
            )}
            {aCompleter(MENTIONS.conservationMessages) ? null : (
              <> Durée de conservation des messages : {MENTIONS.conservationMessages}.</>
            )}
          </p>
          <p>
            Vous pouvez demander l'accès, la rectification ou la suppression de vos données à{" "}
            <a href={`mailto:${CLUB.email}`}>{CLUB.email}</a>. Réclamation possible auprès de la CNIL (cnil.fr).
          </p>
        </section>
        <section id="cookies" className="mentions__bloc">
          <h2>Cookies</h2>
          <p>
            Aucun cookie publicitaire ni outil de mesure d'audience. Sont utilisés : un stockage technique qui mémorise
            vos choix (6 mois, dans votre navigateur), un cookie de session pour l'Espace dirigeants (réservé au bureau
            du club), et les contenus intégrés — carte Google Maps, widget des résultats de matchs — qui ne se chargent
            qu'après votre accord. Refuser ne limite en rien l'accès aux informations du site.
          </p>
          <BoutonCookies className="btn btn--bleu">Modifier mes choix de cookies</BoutonCookies>
        </section>
        <section className="mentions__bloc mentions__bloc--bleu">
          <h2>Droit à l'image</h2>
          <p>
            Aucune photo de mineur n'est publiée sans autorisation écrite des représentants légaux, recueillie à
            l'inscription (oui ou non, modifiable à tout moment). Les photos sont retirées sur simple demande, sans
            justification : <Link href="/contact?sujet=image">nous écrire</Link>.
          </p>
        </section>
        <section className="mentions__bloc">
          <h2>Propriété intellectuelle</h2>
          <p>
            Le logo, les textes et les photos appartiennent au Nantes Breil Basket ou à leurs auteurs (dont l'Atelier photo Emmatitia
            pour les photos créditées). Toute réutilisation nécessite une autorisation préalable.
          </p>
        </section>
        <section className="mentions__bloc">
          <h2>Accessibilité</h2>
          <p>
            Le site vise des contrastes suffisants, une navigation complète au clavier (lien « Aller au contenu », focus
            visible) et des textes alternatifs sur les images. Un problème ? <Link href="/contact">Signalez-le</Link>,
            nous corrigeons.
          </p>
        </section>
      </div>
    </>
  );
}
