import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Confira as regras gerais de uso do NBA Radar."
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Termos de Uso"
      subtitle="Regras gerais para uso do NBA Radar."
      updatedAt="12 de maio de 2026"
    >
      <section>
        <h2>1. Aceitação dos termos</h2>
        <p>
          Ao acessar ou usar o NBA Radar, o usuário declara estar de acordo com estes Termos de Uso
          e com as regras aplicáveis à plataforma.
        </p>
      </section>

      <section>
        <h2>2. Sobre o serviço</h2>
        <p>
          O NBA Radar oferece informações esportivas, placares, estatísticas, detalhes de partidas,
          prêmios, Draft e recursos personalizados, incluindo conta de usuário e time favorito.
        </p>
      </section>

      <section>
        <h2>3. Projeto independente</h2>
        <p>
          O NBA Radar não é afiliado oficialmente à NBA, ESPN, times, ligas ou marcas mencionadas.
          Marcas, nomes e conteúdos externos pertencem aos seus respectivos proprietários.
        </p>
      </section>

      <section>
        <h2>4. Dados esportivos</h2>
        <p>
          Os dados exibidos podem vir de fontes externas e podem sofrer atrasos, indisponibilidade
          ou divergências. O site não garante precisão absoluta em tempo real.
        </p>
      </section>

      <section>
        <h2>5. Conta de usuário</h2>
        <p>
          Usuários podem criar conta, escolher time favorito e salvar preferências. O usuário é
          responsável por manter o acesso à sua conta em segurança e por usar credenciais próprias.
        </p>
      </section>

      <section>
        <h2>6. Uso permitido</h2>
        <p>Ao usar o NBA Radar, o usuário não deve:</p>
        <ul>
          <li>Tentar invadir, explorar ou comprometer sistemas da plataforma.</li>
          <li>Abusar de APIs ou automatizar acessos de forma prejudicial.</li>
          <li>Usar o site para fins ilegais.</li>
          <li>Copiar, revender ou redistribuir dados sem autorização adequada.</li>
        </ul>
      </section>

      <section>
        <h2>7. Conteúdo e propriedade intelectual</h2>
        <p>
          A identidade do NBA Radar pertence ao projeto. Marcas citadas pertencem aos seus
          respectivos proprietários. Vídeos, imagens e dados externos pertencem às fontes originais.
        </p>
      </section>

      <section>
        <h2>8. Melhores momentos e vídeos</h2>
        <p>
          Quando vídeos aparecem no site, eles são incorporados ou linkados a partir de fontes
          externas. O NBA Radar não baixa, hospeda ou redistribui vídeos protegidos.
        </p>
      </section>

      <section>
        <h2>9. Limitação de responsabilidade</h2>
        <p>
          O site é fornecido como está, sem garantia de disponibilidade contínua, ausência de erros
          ou funcionamento ininterrupto de integrações externas.
        </p>
      </section>

      <section>
        <h2>10. Alterações nos termos</h2>
        <p>
          Estes termos podem ser atualizados futuramente para refletir mudanças no projeto,
          integrações, funcionalidades ou obrigações aplicáveis.
        </p>
      </section>

      <section>
        <h2>11. Contato</h2>
        <p>
          Para dúvidas sobre estes termos, acesse a página de <Link href="/contato">contato</Link>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
