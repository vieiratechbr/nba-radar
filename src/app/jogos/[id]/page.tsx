import type { Metadata } from "next";
import { GameDetailsClient } from "@/components/GameDetailsClient";
import { LayoutWrapper } from "@/components/LayoutWrapper";

interface GameDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Detalhes do Jogo",
  description: "Central de acompanhamento de jogo da NBA com dados da ESPN."
};

export default async function GameDetailsPage({ params }: GameDetailsPageProps) {
  const { id } = await params;

  return (
    <LayoutWrapper className="py-10 sm:py-14">
      <GameDetailsClient gameId={id} />
    </LayoutWrapper>
  );
}
