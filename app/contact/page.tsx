import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CLUB } from "@/data/club";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contacter ${CLUB.name} : coordonnées, inscriptions et réseaux sociaux.`,
};

export default function ContactPage() {
  const items: { label: string; content: React.ReactNode }[] = [];

  if (CLUB.email)
    items.push({
      label: "E-mail",
      content: <a href={`mailto:${CLUB.email}`}>{CLUB.email}</a>,
    });
  if (CLUB.phone)
    items.push({
      label: "Téléphone",
      content: <a href={`tel:${CLUB.phone.replace(/\s/g, "")}`}>{CLUB.phone}</a>,
    });
  if (CLUB.address)
    items.push({ label: "Adresse", content: CLUB.address });
  if (CLUB.facebook)
    items.push({
      label: "Facebook",
      content: (
        <a href={CLUB.facebook} target="_blank" rel="noopener noreferrer">
          Page du club
        </a>
      ),
    });
  if (CLUB.instagram)
    items.push({
      label: "Instagram",
      content: (
        <a href={CLUB.instagram} target="_blank" rel="noopener noreferrer">
          Compte du club
        </a>
      ),
    });

  return (
    <>
      <PageHero
        title="Contact"
        intro="Une question sur les inscriptions, les horaires ou les équipes ?"
      />
      <div className="container page-body page-body--spaced">
        {items.length > 0 ? (
          <dl className="contact-list">
            {items.map((item) => (
              <div key={item.label} className="contact-row">
                <dt>{item.label}</dt>
                <dd>{item.content}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="empty-note">
            Les coordonnées du club seront bientôt disponibles.
          </p>
        )}

        {CLUB.inscriptionUrl && (
          <p>
            <a
              className="btn btn-accent"
              href={CLUB.inscriptionUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              S’inscrire au club
            </a>
          </p>
        )}
      </div>
    </>
  );
}
