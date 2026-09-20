import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PlanningExplorer } from "@/components/PlanningExplorer";
import { getDays, getGymnases, getTeams } from "@/lib/planning";

export const metadata: Metadata = {
  title: "Planning des entraînements",
  description:
    "Tous les créneaux d’entraînement de Nantes Breil Basket : gymnase, horaires, équipes et coachs.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function pick(value: string | string[] | undefined, allowed: readonly string[]) {
  const v = Array.isArray(value) ? value[0] : value;
  return v && allowed.includes(v) ? v : "";
}

export default async function PlanningPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  return (
    <>
      <PageHero
        title="Planning des entraînements"
        intro="Retrouvez chaque créneau : gymnase, horaires, équipes et coachs."
      />
      <div className="container page-body">
        <PlanningExplorer
          initialTeam={pick(params.equipe, getTeams())}
          initialGymnase={pick(params.gymnase, getGymnases())}
          initialDay={pick(params.jour, getDays())}
        />
      </div>
    </>
  );
}
