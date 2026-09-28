import type { Metadata } from "next";
import { CLUB } from "@/data/nbb";
import { agendaAVenir } from "@/lib/nbb";
import { EntetePage } from "@/components/Page";
import { ListeAgenda } from "@/components/ListeAgenda";
import { Terrain } from "@/components/Terrain";

export const metadata: Metadata = {
  title: "Agenda du club",
  description: `L'agenda du Nantes Breil Basket : soirées de match, tournois, Noël du NBB, stages et temps forts de la saison ${CLUB.saison}.`,
  alternates: { canonical: "/agenda" },
};

// Les dates passées disparaissent seules : la page est régénérée toutes les heures.
export const revalidate = 3600;

export default function Agenda() {
  return (
    <>
      <EntetePage
        fil="Agenda"
        style={{ paddingBottom: 40 }}
        decor={<Terrain motif="raquette" style={{ top: 0, right: "8%", width: "min(40%, 480px)" }} />}
        titre={
          <>
            L'agenda <span className="accent">du club</span>
          </>
        }
        chapo="Soirées de match, tournois, Noël du NBB, stages : notez les dates, venez encourager, donnez un coup de main."
      />
      <section id="agenda" aria-labelledby="agenda-titre">
        <div className="section" style={{ maxWidth: 1100, paddingTop: 48, paddingBottom: 88 }}>
          <h2 id="agenda-titre" className="sr-only">
            Temps forts de la saison
          </h2>
          <ListeAgenda dates={agendaAVenir()} clair />
        </div>
      </section>
    </>
  );
}
