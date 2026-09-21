import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { SmartLink } from "@/components/SmartLink";
import { ALBUMS } from "@/data/nbb";
import { metaPage } from "@/lib/seo";
import { grille } from "@/lib/style";
import { estLienExterne } from "@/lib/utils";

export const metadata = metaPage({
  titre: "Galerie photos",
  description:
    "Les photos du Nantes Breil Basket : matchs, journée du mini-basket, tournois, stages et vie du club, saison après saison.",
  chemin: "/galerie",
});

export default function PageGalerie() {
  return (
    <div className="page">
      <PageHero kicker="Photos" title="Galerie">
        <p className="lead">
          Les moments du club, saison après saison. Merci à EMMATITIA et aux parents photographes.
        </p>
      </PageHero>

      <section className="section">
        <ul className="grid" style={grille(260)}>
          {ALBUMS.map((a) => {
            const contenu = (
              <>
                <Photo
                  photo={a.photo}
                  alt={`Album : ${a.titre}`}
                  className="album__photo"
                  sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 33vw"
                />
                <span className="album__body" style={{ display: "block" }}>
                  <span className="album__title" style={{ display: "block" }}>
                    {a.titre}
                  </span>
                  <span className="album__meta" style={{ display: "block" }}>
                    {a.meta}
                  </span>
                </span>
              </>
            );
            return (
              <li key={a.titre}>
                {estLienExterne(a.lien) || a.lien.startsWith("/") ? (
                  <SmartLink href={a.lien} className="album">
                    {contenu}
                  </SmartLink>
                ) : (
                  <div className="album">{contenu}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="section">
        <div className="card card--accent">
          <p className="accent-title">Droit à l&apos;image des mineurs</p>
          <p className="accent-text">
            Aucune photo d&apos;un enfant n&apos;est publiée sans autorisation écrite de ses représentants légaux. Les
            photos de groupe privilégient les plans larges et ne comportent ni nom ni information personnelle. Pour
            faire retirer une photo, un message suffit : <Link href="/contact?sujet=image">nous contacter</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
