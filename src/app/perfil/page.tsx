import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FavoriteTeamDashboard } from "@/components/favorite-team/FavoriteTeamDashboard";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { getFavoriteTeamDashboard } from "@/services/favoriteTeamService";
import { getCurrentProfile } from "@/services/profileService";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Meu Radar",
  description: "Área personalizada do NBA Radar para acompanhar seu time favorito."
};

export default async function ProfilePage() {
  const { user, profile } = await getCurrentProfile();

  if (!user) {
    redirect("/login?redirectTo=/perfil");
  }

  if (!profile?.favorite_team_id) {
    redirect("/onboarding/time-favorito");
  }

  const dashboard = await getFavoriteTeamDashboard(profile);

  if (!dashboard) {
    redirect("/onboarding/time-favorito");
  }

  return (
    <LayoutWrapper className="py-10 sm:py-14">
      <FavoriteTeamDashboard data={dashboard} />
    </LayoutWrapper>
  );
}
