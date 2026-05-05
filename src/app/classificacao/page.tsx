import type { Metadata } from "next";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { PageHero } from "@/components/PageHero";
import { StandingsClient } from "@/components/StandingsClient";

export const metadata: Metadata = {
  title: "Classificação",
  description: "Tabela de classificação da NBA por conferência."
};

export default function StandingsPage() {
  return (
    <>
      <PageHero
        eyebrow="Classificação"
        title="Classificação"
        description="Acompanhe a posição dos times na temporada."
      />
      <LayoutWrapper className="py-10 sm:py-14">
        <StandingsClient />
      </LayoutWrapper>
    </>
  );
}
