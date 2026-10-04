import type { Metadata } from "next";
import Link from "next/link";
import { emailConfigure } from "@/lib/email";
import { manquesDuSite, matchsAConvoquer, toutesLesEquipes, type ManqueSite } from "@/lib/nbb";
import { slug } from "@/lib/utils";
import { accesConfigure, estConnecte } from "@/lib/session";
import type { Affectations, BaseAdherents } from "@/lib/adherents";
import { lireAdherents, lireAffectations, lister, listerConvocations, STATUTS, TABLES, type Demande, type Table } from "@/lib/stockage";
import { Connexion, Deconnexion, Statut, Supprimer } from "@/components/dirigeants/Dirigeants";
import { Adherents } from "@/components/dirigeants/Adherents";
import { Convocations } from "@/components/dirigeants/Convocations";
import { TableauStages } from "@/components/dirigeants/TableauStages";
import { TerrainEntete } from "@/components/Page";

export const metadata: Metadata = {
  title: "Espace dirigeants",
  robots: { index: false, follow: false },
};

const ONGLETS: Record<Table, string> = { inscriptions: "Inscriptions", stages: "Stages", contacts: "Messages" };
const TITRES: Record<Table, string> = { inscriptions: "Joueur / joueuse", stages: "Enfant", contacts: "Nom" };
/** Onglet de la liste des informations encore à fournir pour le site. */
const A_COMPLETER = "a-completer";
/** Onglet de saisie des convocations (arbitres, table, OTM) des matchs à domicile. */
const CONVOCATIONS = "convocations";
/** Onglet de la base des adhérents (export des licences). */
const ADHERENTS = "adherents";

/** Informations à fournir, regroupées par bloc (entraîneurs, mentions légales…). */
function parSection(manques: ManqueSite[]) {
  const groupes = new Map<string, { page?: string; lignes: ManqueSite[] }>();
  for (const m of manques) {
    const g = groupes.get(m.section) ?? { page: m.page, lignes: [] };
    g.lignes.push(m);
    groupes.set(m.section, g);
  }
  return [...groupes];
}

function date(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Paris" });
}

export default async function EspaceDirigeants({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const configure = accesConfigure();
  const connecte = configure && (await estConnecte());
  const demande = (await searchParams).onglet;
  const voirManques = demande === A_COMPLETER;
  const voirConvocations = demande === CONVOCATIONS;
  const voirAdherents = demande === ADHERENTS;
  const autreOnglet = voirManques || voirConvocations || voirAdherents;
  const onglet: Table = TABLES.includes(demande as Table) ? (demande as Table) : "inscriptions";
  const enLigne = connecte ? await listerConvocations() : [];
  const manques = connecte ? manquesDuSite(enLigne) : [];
  const aConvoquer = connecte ? matchsAConvoquer(enLigne) : null;
  let adherents: BaseAdherents | null = null;
  let affectations: Affectations = {};
  if (connecte) {
    try {
      adherents = await lireAdherents<BaseAdherents>();
      // Base importée avant la réduction à nom, (qualification,) catégorie et e-mail : à redéposer.
      const champs = ["nom", "qualification", "categorie", "email"];
      if (adherents && !adherents.adherents.every((a) => typeof a.nom === "string" && Object.keys(a).every((k) => champs.includes(k)))) adherents = null;
      if (voirAdherents) affectations = (await lireAffectations<Affectations>()) ?? {};
    } catch (e) {
      console.error("[dirigeants] Base des adhérents illisible :", e);
    }
  }

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
        <TerrainEntete />
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
            et s'exporte en CSV pour Excel. « Convocations » : arbitres, table et OTM des matchs à domicile. L'onglet
            « À compléter » liste les informations que le site attend encore.
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
                    aria-current={!autreOnglet && t === onglet ? "page" : undefined}
                    className="onglets__lien"
                    prefetch={false}
                  >
                    {ONGLETS[t]} · {listes?.[t].length ?? 0}
                  </Link>
                ))}
                <Link
                  href={`/espace-dirigeants?onglet=${ADHERENTS}`}
                  aria-current={voirAdherents ? "page" : undefined}
                  className="onglets__lien"
                  prefetch={false}
                >
                  Adhérents · {adherents?.adherents.filter((a) => a.qualification).length ?? 0}
                </Link>
                <Link
                  href={`/espace-dirigeants?onglet=${CONVOCATIONS}`}
                  aria-current={voirConvocations ? "page" : undefined}
                  className="onglets__lien"
                  prefetch={false}
                >
                  Convocations
                </Link>
                <Link
                  href={`/espace-dirigeants?onglet=${A_COMPLETER}`}
                  aria-current={voirManques ? "page" : undefined}
                  className="onglets__lien"
                  prefetch={false}
                >
                  À compléter sur le site · {manques.length}
                </Link>
              </nav>
              <div className="rangee rangee--10">
                {!autreOnglet && lignes.length ? (
                  <a href={`/espace-dirigeants/export?table=${onglet}`} className="btn btn--s btn--petit btn--orange">
                    Exporter en CSV (Excel)
                  </a>
                ) : null}
                <Deconnexion />
              </div>
            </div>
            {voirManques ? (
              <div className="manques">
                <p className="manques__intro">
                  Ces informations sont encore marquées « [À COMPLÉTER] » ou « [À CONFIRMER] » dans le fichier{" "}
                  <span className="mono">data/nbb.ts</span> : elles ne s'affichent pas sur le site tant qu'elles ne sont pas
                  remplies. Le chemin indiqué permet de les retrouver dans le fichier (mode d'emploi : NOTICE.md).
                </p>
                {manques.length === 0 ? (
                  <div className="vide">Tout est renseigné : aucune information en attente.</div>
                ) : (
                  parSection(manques).map(([section, g]) => (
                    <section key={section} className="manques__groupe" aria-labelledby={`manques-${slug(section)}`}>
                      <div className="manques__tete">
                        <h2 id={`manques-${slug(section)}`}>
                          {section} · {g.lignes.length}
                        </h2>
                        {g.page ? (
                          <Link href={g.page} prefetch={false}>
                            Voir la page
                          </Link>
                        ) : null}
                      </div>
                      <ul className="manques__liste">
                        {g.lignes.map((m) => (
                          <li key={m.chemin + m.champ}>
                            <strong>{[m.element, m.champ].filter(Boolean).join(" · ") || section}</strong>
                            <span className="manques__valeur">{m.valeur}</span>
                            <span className="mono manques__chemin">{m.chemin}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))
                )}
              </div>
            ) : null}
            {/* La base (données personnelles) n'est envoyée au navigateur que dans son onglet. */}
            {voirAdherents ? <Adherents base={adherents} affectations={affectations} equipes={toutesLesEquipes()} /> : null}
            {voirConvocations && aConvoquer ? (
              <Convocations
                weekends={aConvoquer.weekends}
                // Liste des champs : adhérents (base importée), puis toutes les équipes du club.
                choix={[...(adherents?.adherents.map((a) => a.nom) ?? []), ...aConvoquer.suggestions.noms, ...aConvoquer.suggestions.equipes]}
              />
            ) : null}
            {!autreOnglet && erreur ? <p className="erreur-globale">{erreur}</p> : null}
            {!autreOnglet && !erreur && lignes.length === 0 ? (
              <div className="vide">
                Aucune demande pour l'instant. Elles arrivent ici depuis les formulaires{" "}
                <Link href="/inscriptions#formulaire">Inscriptions</Link>, <Link href="/stages#inscription-stage">Stages</Link>{" "}
                et <Link href="/contact">Contact</Link>.
              </div>
            ) : null}
            {/* Stages : un tableau (une ligne par inscription) ; les autres demandes restent en cartes. */}
            {!autreOnglet && onglet === "stages" && lignes.length ? (
              <TableauStages
                demandes={lignes}
                // Confirmations par e-mail : messagerie SMTP configurée, sinon envoi simulé en local.
                messagerie={emailConfigure() ? "ok" : process.env.NODE_ENV !== "production" ? "simulee" : "absente"}
              />
            ) : null}
            <div className="grille grille--remplir" style={{ "--min": "340px" } as React.CSSProperties}>
              {(autreOnglet || onglet === "stages" ? [] : lignes).map((r) => (
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
