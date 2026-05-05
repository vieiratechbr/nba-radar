import type { Metadata } from "next";
import { DraftClient } from "@/components/DraftClient";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Draft",
  description: "Prospectos, ranking e projeções de escolhas do Draft da NBA."
};

export default function DraftPage() {
  return (
    <>
      <PageHero
        eyebrow="Draft"
        title="Draft"
        description="Prospectos, ranking e projeções de escolhas."
      />
      <LayoutWrapper className="py-10 sm:py-14">
        <DraftClient />
      </LayoutWrapper>
    </>
  );
}
