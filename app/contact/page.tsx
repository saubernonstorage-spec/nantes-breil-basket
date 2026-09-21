import Link from "next/link";
import { Suspense } from "react";
import { ContactForm, ContactFormDepuisUrl } from "@/components/formulaires/ContactForm";
import { PageHero } from "@/components/PageHero";
import { Socials } from "@/components/Socials";
import { CLUB } from "@/data/nbb";
import { metaPage } from "@/lib/seo";
import { grille } from "@/lib/style";
import { estACompleter, estEmail, lienTelephone } from "@/lib/utils";

export const metadata = metaPage({
  titre: "Contact",
  description:
    "Contacter le Nantes Breil Basket : formulaire, e-mail, réseaux sociaux et groupe WhatsApp du club de basket du quartier Breil à Nantes.",
  chemin: "/contact",
});

export default function PageContact() {
  const email = CLUB.email.trim();
  const telephone = CLUB.telephone.trim();

  return (
    <div className="page">
      <PageHero kicker="Contact" title="On vous répond">
        <p className="lead">
          Une question sur une inscription, un créneau, un déplacement ? Écrivez-nous — mais jetez d&apos;abord un
          œil à la <Link href="/inscriptions#faq">FAQ</Link>, la réponse y est peut-être déjà.
        </p>
      </PageHero>

      <section className="section">
        <div className="grid" style={grille(300, { align: "start" })}>
          <div className="card card--strong">
            <Suspense fallback={<ContactForm delaiReponse={CLUB.delaiReponse} />}>
              <ContactFormDepuisUrl delaiReponse={CLUB.delaiReponse} />
            </Suspense>
          </div>

          <div className="stack">
            <div className="card card--strong">
              <h2 className="title-card title-card--lg" style={{ marginBottom: 16 }}>
                Coordonnées
              </h2>
              <p className="text-soft text-md" style={{ marginBottom: 10 }}>
                <strong style={{ color: "#fff" }}>E-mail :</strong>{" "}
                {!estACompleter(email) && estEmail(email) ? <a href={`mailto:${email}`}>{email}</a> : email}
              </p>
              <p className="text-soft text-md" style={{ marginBottom: 10 }}>
                <strong style={{ color: "#fff" }}>Téléphone :</strong>{" "}
                {!estACompleter(telephone) ? <a href={lienTelephone(telephone)}>{telephone}</a> : telephone}
              </p>
              <p className="text-soft text-md">
                <strong style={{ color: "#fff" }}>Adresse :</strong> {CLUB.adresse}
              </p>
            </div>
            <div className="card card--strong">
              <h2 className="title-card title-card--lg" style={{ marginBottom: 16 }}>
                Suivre le club
              </h2>
              <Socials />
            </div>
            <div className="card card--accent" style={{ borderRadius: 22 }}>
              <p className="accent-title">Urgence un jour de match ?</p>
              <p className="accent-text">
                Passez par le groupe WhatsApp du club : c&apos;est là que les changements d&apos;horaire et de gymnase
                sont annoncés en premier.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
