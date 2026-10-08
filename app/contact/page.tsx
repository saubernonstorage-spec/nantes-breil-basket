import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CLUB } from "@/data/nbb";
import { EntetePage } from "@/components/Page";
import { ContactAvecAdresse, ContactForm } from "@/components/formulaires/ContactForm";
import { IconeWhatsapp, NouvelOnglet } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contacter le Nantes Breil Basket, club de basket à Nantes : formulaire de contact, adresse, réseaux sociaux et groupe WhatsApp.`,
  alternates: { canonical: "/contact" },
};

const RAPIDES = [
  { href: "/planning", etiquette: "Horaires", texte: "Quand s'entraîne mon enfant ?" },
  { href: "/matchs", etiquette: "Week-end", texte: "À quelle heure est le match ?" },
  { href: "/inscriptions#tarifs", etiquette: "Tarifs", texte: "Combien coûte la licence ?" },
  { href: "/infos#faq", etiquette: "FAQ", texte: "Toutes les questions fréquentes" },
];

export default function Contact() {
  return (
    <>
      <EntetePage
        fil="Contact"
        largeurChapo={620}
        titre={
          <>
            On vous <span className="accent">répond</span>
          </>
        }
        chapo="Le club est géré par des bénévoles : jetez d'abord un œil aux réponses rapides ci-dessous, la vôtre y est peut-être déjà."
      >
        <nav aria-label="Réponses rapides" className="grille reponses-rapides" style={{ "--min": "200px", gap: 10 } as React.CSSProperties}>
          {RAPIDES.map((r) => (
            <Link key={r.href} href={r.href} className="reponse-rapide">
              <span>{r.etiquette}</span>
              {r.texte}
            </Link>
          ))}
        </nav>
      </EntetePage>

      <section className="section" style={{ paddingBottom: 88 }}>
        <div className="rangee" style={{ gap: 16, alignItems: "flex-start" }}>
          <div className="carte-formulaire">
            <Suspense fallback={<ContactForm delaiReponse={CLUB.delaiReponseContact} />}>
              <ContactAvecAdresse delaiReponse={CLUB.delaiReponseContact} />
            </Suspense>
          </div>
          <aside className="contact-cote">
            <div className="contact-bloc contact-bloc--nuit">
              <h2 className="titre-bloc">Coordonnées</h2>
              <p>
                {CLUB.adresse.split("\n").map((l, i) => (
                  <span key={l}>
                    {i > 0 ? <br /> : null}
                    {l}
                  </span>
                ))}
              </p>
            </div>
            <div className="contact-bloc">
              <h2 className="titre-bloc" style={{ marginBottom: 10 }}>
                Boîte aux lettres
              </h2>
              <p className="texte-doux">{CLUB.boiteAuxLettres}. Pour les dossiers, chèques et règlements de stage.</p>
            </div>
            <div className="contact-bloc contact-bloc--orange">
              <h2 className="titre-bloc">Urgence un jour de match ?</h2>
              <p>Les changements d'horaire et de gymnase sont annoncés en premier sur le groupe WhatsApp du club.</p>
              <a href={CLUB.whatsapp} target="_blank" rel="noopener" className="btn btn--nuit" style={{ alignSelf: "flex-start" }}>
                <IconeWhatsapp />
                Rejoindre le groupe
                <NouvelOnglet />
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
