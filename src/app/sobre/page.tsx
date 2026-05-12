import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça o NBA Radar, uma central independente para acompanhar a NBA."
};

export default function AboutPage() {
  return (
    <LegalPageLayout
      title="Sobre o NBA Radar"
      subtitle="Uma central independente para acompanhar a NBA com placares, estatísticas, detalhes de partidas e experiência personalizada."
    >
      <section>
        <h2>O que é o NBA Radar</h2>
        <p>
          O NBA Radar é um projeto independente criado para reunir informações da NBA em uma
          experiência moderna, rápida e personalizada. A proposta é oferecer uma interface
          esportiva premium para acompanhar a liga com clareza, ritmo e foco no que importa.
        </p>
      </section>

      <section>
        <h2>Funcionalidades principais</h2>
        <p>
          A plataforma organiza dados e áreas úteis para quem acompanha a temporada no dia a dia.
        </p>
        <ul>
          <li>Placares e jogos do dia.</li>
          <li>Detalhes das partidas, estatísticas, lances e box score.</li>
          <li>Classificação da temporada.</li>
          <li>Prêmios, Draft e prospectos.</li>
          <li>Melhores momentos quando fontes externas disponibilizam vídeos.</li>
          <li>Conta de usuário, time favorito e painel personalizado.</li>
        </ul>
      </section>

      <section>
        <h2>Personalização por time favorito</h2>
        <p>
          Usuários cadastrados podem escolher uma franquia como time do coração. A partir disso,
          o NBA Radar pode destacar próximos jogos, últimos resultados, posição na classificação
          e aplicar cores do time em pontos da interface.
        </p>
      </section>

      <section>
        <h2>Projeto independente</h2>
        <p>
          O NBA Radar é um projeto independente e não possui afiliação oficial com a NBA, ESPN,
          equipes, ligas ou marcas citadas. Nomes, marcas, vídeos e dados externos pertencem aos
          seus respectivos proprietários.
        </p>
      </section>

      <section>
        <h2>Tecnologias</h2>
        <p>
          O projeto utiliza Next.js, React, TypeScript, Tailwind CSS, Supabase para autenticação
          e banco de dados, além de integrações com fontes esportivas externas quando disponíveis.
        </p>
      </section>
    </LegalPageLayout>
  );
}
