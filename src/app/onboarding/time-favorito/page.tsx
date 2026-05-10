import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FavoriteTeamSelector } from "@/components/favorite-team/FavoriteTeamSelector";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { PageHero } from "@/components/PageHero";
import { mockTeams } from "@/data/mockTeams";
import { getEspnTeams } from "@/integrations/espn/espnAdapter";
import { getCurrentUser } from "@/services/profileService";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Escolha seu time",
  description: "Escolha seu time do coração no NBA Radar."
};

async function getTeamsForSelection() {
  try {
    const teams = await getEspnTeams();
    return teams.length ? teams : mockTeams;
  } catch {
    return mockTeams;
  }
}

export default async function FavoriteTeamOnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirectTo=/onboarding/time-favorito");
  }

  const teams = await getTeamsForSelection();

  return (
    <>
      <PageHero
        eyebrow="Time favorito"
        title="Escolha seu time do coração."
        description="Seu radar personalizado começa pelo time que você quer acompanhar de perto."
      />
      <LayoutWrapper className="py-10 sm:py-14">
        <FavoriteTeamSelector teams={teams} />
      </LayoutWrapper>
    </>
  );
}
