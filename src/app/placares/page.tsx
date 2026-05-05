import type { Metadata } from "next";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { PageHero } from "@/components/PageHero";
import { ScoresClient } from "@/components/ScoresClient";
import { getGames, getTeams } from "@/services/gamesService";

export const metadata: Metadata = {
  title: "Placares",
  description: "Placar de jogos da NBA com filtros por data, status e time."
};

export default async function ScoresPage() {
  const [games, teams] = await Promise.all([getGames(), getTeams()]);

  return (
    <>
      <PageHero
        eyebrow="Placares"
        title="A rodada da NBA em cards rápidos e filtráveis."
        description="Veja jogos por data, partidas ao vivo, finalizadas e próximos confrontos com dados reais da ESPN e fallback de demonstração apenas em caso de erro."
      />
      <LayoutWrapper className="py-10 sm:py-14">
        <ScoresClient games={games} teams={teams} />
      </LayoutWrapper>
    </>
  );
}
