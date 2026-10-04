import type { Metadata } from "next";
import Link from "next/link";
import { ALBUMS } from "@/data/nbb";
import { EntetePage } from "@/components/Page";
import { Albums } from "@/components/Albums";

export const metadata: Metadata = {
  title: "Galerie photos",
  description: "Galerie photos du Nantes Breil Basket : mini-basket, stages, matchs et vie du club à Nantes.",
  alternates: { canonical: "/galerie" },
};

export default function Galerie() {
  return (
    <>
      <EntetePage
        fil="Galerie"
        largeurChapo={600}
        titre={
          <>
            La <span className="accent">galerie</span>
          </>
        }
        chapo="Les moments du club, saison après saison. Merci à l'Atelier photo Emmatitia, notre partenaire photographe, et aux parents qui immortalisent les matchs."
      />
      <section className="section" style={{ paddingTop: 48, paddingBottom: 40 }}>
        <Albums albums={ALBUMS} />
      </section>
      <section className="section" style={{ paddingTop: 24, paddingBottom: 88 }}>
        <div className="encart-bleu-large" style={{ marginTop: 0, padding: 26, borderRadius: 26 }}>
          <div style={{ maxWidth: 800 }}>
            <h2 className="titre-bloc" style={{ fontSize: 28, marginBottom: 8 }}>
              Droit à l'image des mineurs
            </h2>
            <p>
              Aucune photo d'enfant n'est publiée sans autorisation écrite de ses représentants légaux, recueillie à
              l'inscription. Les photos de groupe privilégient les plans larges et ne comportent ni nom ni information
              personnelle.
            </p>
          </div>
          <Link href="/contact?sujet=image" className="btn btn--petit btn--bleu">
            Demander un retrait
          </Link>
        </div>
      </section>
    </>
  );
}
