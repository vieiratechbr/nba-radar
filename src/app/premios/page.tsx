import type { Metadata } from "next";
import { AwardsClient } from "@/components/AwardsClient";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Prêmios",
  description: "MVP, Rookie of the Year, Defensive Player of the Year e outros vencedores."
};

export default function AwardsPage() {
  return (
    <>
      <PageHero
        eyebrow="Prêmios"
        title="Prêmios"
        description="MVP, Rookie of the Year, Defensive Player of the Year e outros vencedores."
      />
      <LayoutWrapper className="py-10 sm:py-14">
        <AwardsClient />
      </LayoutWrapper>
    </>
  );
}
