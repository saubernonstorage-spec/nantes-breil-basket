import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CLUB, MENTIONS } from "@/data/nbb";
import { metaPage } from "@/lib/seo";

export const metadata = metaPage({
  titre: "Mentions légales et confidentialité",
  description:
    "Mentions légales, politique de confidentialité, cookies et droit à l'image du site du Nantes Breil Basket.",
  chemin: "/mentions-legales",
});

export default function PageMentions() {
  return (
    <div className="page">
      <PageHero kicker="Informations légales" title="Mentions légales & confidentialité" />

      <section className="section legal">
        <h2 id="editeur" className="anchor-target">
          Éditeur du site
        </h2>
        <p>
          {CLUB.nom}, association loi 1901. Siège : {MENTIONS.siege}. Numéro RNA : {MENTIONS.rna}. SIRET :{" "}
          {MENTIONS.siret}. Responsable de la publication : {MENTIONS.responsablePublication}. Contact :{" "}
          {MENTIONS.contact}.
        </p>

        <h2 id="hebergement" className="anchor-target">
          Hébergement
        </h2>
        <p>{MENTIONS.hebergeur}</p>

        <h2 id="donnees" className="anchor-target">
          Données personnelles
        </h2>
        <p>
          Les informations envoyées via le formulaire de contact (nom, e-mail, message) servent uniquement à répondre à
          votre demande. Celles du formulaire d&apos;inscription aux stages (identité et année de naissance de
          l&apos;enfant, coordonnées du parent, informations utiles à sa sécurité) servent uniquement à organiser le
          stage. Elles sont transmises par e-mail aux dirigeants du club, ne sont ni revendues ni utilisées à des fins
          publicitaires, et sont conservées {MENTIONS.conservationMois} mois maximum.
        </p>
        <p>
          Vous pouvez demander l&apos;accès, la rectification ou la suppression de vos données à tout moment en écrivant à{" "}
          {MENTIONS.contact}. Réclamation possible auprès de la{" "}
          <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener">
            CNIL<span className="visually-hidden"> (nouvel onglet)</span>
          </a>
          .
        </p>

        <h2 id="cookies" className="anchor-target">
          Cookies
        </h2>
        <p>
          Le site ne dépose aucun cookie publicitaire et n&apos;utilise pas d&apos;outil de mesure d&apos;audience.
          Seuls sont utilisés : l&apos;enregistrement de votre choix sur les cookies (dans votre navigateur, pendant 6
          mois), et les contenus intégrés (résultats sportifs Score&apos;n&apos;co) qui ne se chargent qu&apos;après
          votre accord via le bandeau. La carte des gymnases provient d&apos;OpenStreetMap, service sans cookie
          publicitaire. Vous pouvez modifier votre choix à tout moment avec le lien « Gérer les cookies » en bas de
          chaque page.
        </p>

        <h2 id="droit-image" className="anchor-target">
          Droit à l&apos;image
        </h2>
        <p>
          Aucune photo de mineur n&apos;est publiée sans autorisation écrite des représentants légaux, recueillie à
          l&apos;inscription. Les photos sont retirées sur simple demande, sans justification à fournir :{" "}
          <Link href="/contact?sujet=image">nous écrire</Link>.
        </p>

        <h2 id="propriete" className="anchor-target">
          Propriété intellectuelle
        </h2>
        <p>
          Le logo, les textes et les photos du site appartiennent au {CLUB.nom} ou à leurs auteurs. Toute réutilisation
          nécessite une autorisation préalable.
        </p>

        <h2 id="accessibilite" className="anchor-target">
          Accessibilité
        </h2>
        <p>
          Le site vise un contraste suffisant, une navigation complète au clavier et des textes alternatifs sur les
          images. Un problème d&apos;accès ? Signalez-le, nous corrigeons : <Link href="/contact">nous contacter</Link>.
        </p>
      </section>
    </div>
  );
}
