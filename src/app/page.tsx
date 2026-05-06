import Link from "next/link";
import { ArrowRight, BarChart3, Medal, Table2, Target } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { ScoreboardSection } from "@/components/ScoreboardSection";
import { SectionTitle } from "@/components/SectionTitle";
import { mockAwards } from "@/data/mockAwards";
import { mockDraftProspects } from "@/data/mockDraftProspects";
import { mockStandings } from "@/data/mockStandings";

const quickLinks = [
  {
    href: "/placares",
    title: "Ver placares",
    description: "Jogos do dia, filtros por data e detalhes completos da partida.",
    icon: BarChart3
  },
  {
    href: "/classificacao",
    title: "Ver classificação",
    description: "Tabela por conferência com campanha, sequência e recortes de desempenho.",
    icon: Table2
  },
  {
    href: "/premios",
    title: "Ver prêmios",
    description: "Base inicial para MVP, novatos, defesa, técnico e outros vencedores.",
    icon: Medal
  },
  {
    href: "/draft",
    title: "Ver draft",
    description: "Ranking, projeções, posições e pontos fortes dos principais prospectos.",
    icon: Target
  }
];

export default async function HomePage() {
  const topStandings = mockStandings.slice(0, 4);
  const awardHighlights = mockAwards.filter((award) => award.season === "2024-25").slice(0, 4);
  const draftWatch = mockDraftProspects.slice(0, 5);

  return (
    <>
      <HeroSection />

      <LayoutWrapper className="grid gap-16 py-12 sm:py-16">
        <ScoreboardSection games={[]} teams={[]} />

        <section>
          <SectionTitle
            eyebrow="Atalhos"
            title="Central NBA Radar"
            description="Acesse rapidamente as principais áreas da central: placares, classificação, prêmios e Draft."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-lg border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-court-red/60 hover:bg-white/[0.06] hover:shadow-glow"
                >
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-md bg-court-red/20 text-court-red">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h2 className="text-xl font-black text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{item.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white transition group-hover:text-court-red">
                    Abrir
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
            <SectionTitle
              eyebrow="Top da classificação"
              title="Times em alta"
              description="Prévia rápida da tabela. A página completa tenta carregar a classificação real via ESPN."
              action={
                <Link
                  href="/classificacao"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-white transition hover:border-court-red hover:text-court-red"
                >
                  Ver tabela
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              }
            />
            <div className="grid gap-3">
              {topStandings.map((team) => (
                <div key={team.id} className="flex items-center justify-between rounded-md border border-white/10 bg-black/20 p-4">
                  <div>
                    <p className="text-sm font-black text-white">#{team.rank} {team.fullName}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                      {team.conference} · {team.division}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-white">{team.wins}-{team.losses}</p>
                    <p className="text-xs text-court-red">{team.streak}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(215,25,32,0.20),transparent_34%),#111217] p-5 shadow-glow">
            <SectionTitle
              eyebrow="Destaques da temporada"
              title="Prêmios e corrida da temporada"
              description="Base local inicial para organizar vencedores e categorias antes de uma integração dedicada."
              action={
                <Link
                  href="/premios"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-white transition hover:border-court-red hover:text-court-red"
                >
                  Ver prêmios
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              }
            />
            <div className="grid gap-3">
              {awardHighlights.map((award) => (
                <div key={award.id} className="rounded-md border border-white/10 bg-black/25 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-court-red">{award.award}</p>
                  <p className="mt-2 text-lg font-black text-white">{award.playerName ?? "A definir"}</p>
                  <p className="text-sm text-zinc-400">{award.team}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <SectionTitle
            eyebrow="Draft Watch"
            title="Radar do Draft"
            description="Ranking inicial de prospectos com projeção, posição e pontos fortes para acompanhar a próxima classe."
            action={
              <Link
                href="/draft"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-white transition hover:border-court-red hover:text-court-red"
              >
                Abrir Draft
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
          <div className="grid gap-4 md:grid-cols-5">
            {draftWatch.map((prospect) => (
              <Link
                href="/draft"
                key={prospect.id}
                className="rounded-lg border border-white/10 bg-court-slate/82 p-4 transition hover:border-court-red/60 hover:bg-[#1d2029]"
              >
                <p className="text-2xl font-black text-court-red">#{prospect.rank}</p>
                <p className="mt-2 text-sm font-black text-white">{prospect.playerName}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  {prospect.position} · Pick {prospect.projectedPick ?? "-"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </LayoutWrapper>
    </>
  );
}
