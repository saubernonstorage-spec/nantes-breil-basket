"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { DetailGymnase } from "@/lib/nbb";
import { grille } from "@/lib/style";
import { carteOsm, estACompleter, lienItineraire, lienPlanning, pluriel } from "@/lib/utils";

/** Carte + liste des gymnases, pour un gymnase sélectionné (ou tous). */
export function GymnasesVue({ gymnases, selection = "" }: { gymnases: DetailGymnase[]; selection?: string }) {
  const avecCoordonnees = gymnases.filter((g) => g.lat !== undefined && g.lon !== undefined);
  const choisi = gymnases.find((g) => g.nom === selection);
  const epingle = choisi?.lat !== undefined && choisi?.lon !== undefined ? choisi : avecCoordonnees[0];
  const carte = epingle?.lat !== undefined && epingle?.lon !== undefined ? carteOsm(epingle.lat, epingle.lon) : null;
  const affiches = choisi ? [choisi] : gymnases;

  return (
    <>
      {carte && epingle && (
        <section className="section" aria-label="Carte">
          <div className="map">
            <iframe
              key={carte.embed}
              title={`Carte des gymnases du Nantes Breil Basket — gymnase ${epingle.nom} épinglé`}
              src={carte.embed}
              loading="lazy"
            />
          </div>
          <p className="map-caption">
            Carte OpenStreetMap (sans cookie publicitaire) — le repère marque le{" "}
            <strong>gymnase {epingle.nom}</strong>
            {!estACompleter(epingle.adresse) && <>, {epingle.adresse}</>}.{" "}
            <a href={carte.lien} target="_blank" rel="noopener" className="link-inline">
              Ouvrir en grand <span className="fleche fleche--diag" aria-hidden="true">↗</span>
              <span className="visually-hidden"> (nouvel onglet)</span>
            </a>
            {choisi && choisi !== epingle && (
              <>
                <br />
                Le gymnase {choisi.nom} n&apos;est pas encore épinglé sur la carte.
              </>
            )}
            {!choisi && avecCoordonnees.length < gymnases.length && (
              <>
                <br />
                Les autres gymnases seront épinglés dès que leurs adresses seront renseignées.
              </>
            )}
          </p>
        </section>
      )}

      <section className="section" aria-labelledby="gymnases">
        <h2 id="gymnases" className="title-section title-section--sm anchor-target" style={{ marginBottom: 16 }}>
          Nos gymnases
        </h2>
        <ul className="chips" style={{ marginBottom: 22 }}>
          {[{ nom: "", label: "Tous les gymnases" }, ...gymnases.map((g) => ({ nom: g.nom, label: g.nom }))].map(
            (c) => (
              <li key={c.label} style={{ display: "flex" }}>
                <Link
                  href={c.nom ? `/infos?gym=${encodeURIComponent(c.nom)}` : "/infos"}
                  scroll={false}
                  className="chip chip--lg"
                  aria-current={selection === c.nom ? "true" : undefined}
                >
                  {c.label}
                </Link>
              </li>
            ),
          )}
        </ul>
        <div className="grid" style={grille(280)}>
          {affiches.map((g) => (
            <div key={g.nom} className="card" style={{ padding: 22 }}>
              <h3 className="title-card" style={{ fontSize: 23, lineHeight: 1.2 }}>
                {g.nom}
              </h3>
              <p className="gym-card__role">{g.role}</p>
              <p className="text-soft text-sm" style={{ marginBottom: 6 }}>
                {g.adresse}
              </p>
              <p className="text-muted text-sm">Accès : {g.acces}</p>
              <div className="gym-card__foot">
                <span>
                  {pluriel(g.nbCreneaux, "créneau", "créneaux")} · {g.jours}
                </span>
                <span style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  {g.nbCreneaux > 0 && (
                    <Link href={lienPlanning({ gym: g.nom })} className="link-inline">
                      Planning
                    </Link>
                  )}
                  {!estACompleter(g.adresse) && (
                    <a href={lienItineraire(g.adresse)} target="_blank" rel="noopener" className="link-inline">
                      Itinéraire <span className="fleche fleche--diag" aria-hidden="true">↗</span>
                      <span className="visually-hidden"> vers le gymnase {g.nom} (nouvel onglet)</span>
                    </a>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/** Lit le gymnase demandé dans l'adresse (ex. /infos?gym=Breil). */
export function InfosGymnases({ gymnases }: { gymnases: DetailGymnase[] }) {
  const demande = useSearchParams().get("gym") ?? "";
  const selection = gymnases.some((g) => g.nom === demande) ? demande : "";
  return <GymnasesVue gymnases={gymnases} selection={selection} />;
}
