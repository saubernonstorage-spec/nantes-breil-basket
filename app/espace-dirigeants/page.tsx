import type { Metadata } from "next";
import Link from "next/link";
import { accesConfigure, estConnecte } from "@/lib/session";
import { lister, STATUTS, TABLES, type Demande, type Table } from "@/lib/stockage";
import { Connexion, Deconnexion, Statut, Supprimer } from "@/components/dirigeants/Dirigeants";

export const metadata: Metadata = {
  title: "Espace dirigeants",
  robots: { index: false, follow: false },
};

const ONGLETS: Record<Table, string> = { inscriptions: "Inscriptions", stages: "Stages", contacts: "Messages" };
const TITRES: Record<Table, string> = { inscriptions: "Joueur / joueuse", stages: "Enfant", contacts: "Nom" };

function date(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Paris" });
}

export default async function EspaceDirigeants({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const configure = accesConfigure();
  const connecte = configure && (await estConnecte());
  const demande = (await searchParams).onglet;
  const onglet: Table = TABLES.includes(demande as Table) ? (demande as Table) : "inscriptions";

  let listes: Record<Table, Demande[]> | null = null;
  let erreur = "";
  if (connecte) {
    try {
      const [a, b, c] = await Promise.all(TABLES.map((t) => lister(t)));
      listes = { inscriptions: a, stages: b, contacts: c };
    } catch (e) {
      console.error("[dirigeants] Lecture impossible :", e);
      erreur = "Les demandes n'ont pas pu être chargées. Réessayez dans un instant.";
    }
  }
  const lignes = listes?.[onglet] ?? [];

  return (
    <>
      <section className="entete-page">
        <div className="entete-page__inner dirigeants-tete">
          <div>
            <div className="surtitre" style={{ marginBottom: 12 }}>
              Accès réservé
            </div>
            <h1 className="titre-page" style={{ margin: 0 }}>
              Espace dirigeants
            </h1>
          </div>
          <p className="texte-clair" style={{ maxWidth: 520, margin: 0, fontSize: 14 }}>
            Les demandes reçues par le site : préinscriptions, stages et messages. Chaque demande a un numéro, un statut,
            et s'exporte en CSV pour Excel.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 32, paddingBottom: 88 }}>
        {!configure ? (
          <div className="vide" style={{ maxWidth: 640, margin: "24px auto" }}>
            <strong>Accès pas encore configuré</strong>
            Définissez la variable d'environnement ADMIN_PASSWORD dans les réglages de l'hébergeur (Netlify → Project
            configuration → Environment variables), puis redéployez le site.
          </div>
        ) : !connecte ? (
          <Connexion />
        ) : (
          <>
            <div className="dirigeants-barre">
              <nav aria-label="Type de demandes" className="onglets">
                {TABLES.map((t) => (
                  <Link
                    key={t}
                    href={`/espace-dirigeants?onglet=${t}`}
                    aria-current={t === onglet ? "page" : undefined}
                    className="onglets__lien"
                    prefetch={false}
                  >
                    {ONGLETS[t]} · {listes?.[t].length ?? 0}
                  </Link>
                ))}
              </nav>
              <div className="rangee rangee--10">
                {lignes.length ? (
                  <a href={`/espace-dirigeants/export?table=${onglet}`} className="btn btn--s btn--petit btn--orange">
                    Exporter en CSV (Excel)
                  </a>
                ) : null}
                <Deconnexion />
              </div>
            </div>
            {erreur ? <p className="erreur-globale">{erreur}</p> : null}
            {!erreur && lignes.length === 0 ? (
              <div className="vide">
                Aucune demande pour l'instant. Elles arrivent ici depuis les formulaires{" "}
                <Link href="/inscriptions#formulaire">Inscriptions</Link>, <Link href="/stages#inscription-stage">Stages</Link>{" "}
                et <Link href="/contact">Contact</Link>.
              </div>
            ) : null}
            <div className="grille grille--remplir" style={{ "--min": "340px" } as React.CSSProperties}>
              {lignes.map((r) => (
                <article key={r.id} className="demande">
                  <div className="demande__tete">
                    <div>
                      <h2>{r.champs[TITRES[onglet]] ?? r.id}</h2>
                      <span className="mono demande__ref">
                        {r.id} · {date(r.recuLe)}
                      </span>
                    </div>
                    <Statut table={onglet} id={r.id} statut={r.statut} statuts={STATUTS} />
                  </div>
                  <dl className="demande__champs">
                    {Object.entries(r.champs)
                      .filter(([k]) => k !== TITRES[onglet])
                      .map(([k, v]) => (
                        <div key={k}>
                          <dt>{k}</dt>
                          <dd>{v || "—"}</dd>
                        </div>
                      ))}
                  </dl>
                  <Supprimer table={onglet} id={r.id} />
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
