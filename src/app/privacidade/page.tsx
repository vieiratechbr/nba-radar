import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Entenda como o NBA Radar lida com dados e privacidade."
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Política de Privacidade"
      subtitle="Entenda como o NBA Radar lida com dados, autenticação, preferências e serviços externos."
      updatedAt="12 de maio de 2026"
    >
      <section>
        <h2>1. Coleta de informações</h2>
        <p>
          O NBA Radar pode coletar informações fornecidas diretamente pelo usuário para viabilizar
          cadastro, login e personalização da experiência.
        </p>
        <ul>
          <li>Nome.</li>
          <li>E-mail.</li>
          <li>Time favorito.</li>
          <li>Preferências de uso.</li>
          <li>Jogadores ou jogos favoritos, caso esses recursos sejam implementados futuramente.</li>
        </ul>
      </section>

      <section>
        <h2>2. Autenticação</h2>
        <p>
          O projeto pode usar Supabase Auth para login, cadastro e gerenciamento de sessão. O NBA
          Radar não armazena senhas diretamente; esse processo é gerenciado por serviço
          especializado de autenticação.
        </p>
      </section>

      <section>
        <h2>3. Dados de uso e preferências</h2>
        <p>
          Podemos armazenar preferências para melhorar a experiência, como time favorito, tema
          visual, configurações de notificação e ajustes de personalização.
        </p>
      </section>

      <section>
        <h2>4. Serviços externos</h2>
        <p>
          O NBA Radar utiliza ou pode utilizar serviços externos necessários ao funcionamento da
          plataforma.
        </p>
        <ul>
          <li>Supabase para autenticação e banco de dados.</li>
          <li>Endpoints da ESPN para dados esportivos.</li>
          <li>Highlightly API para dados complementares, se configurada.</li>
          <li>Vercel ou provedor equivalente para hospedagem.</li>
          <li>Google AdSense ou serviços de anúncios no futuro.</li>
        </ul>
      </section>

      <section>
        <h2>5. Cookies e tecnologias similares</h2>
        <p>
          Cookies ou tecnologias similares podem ser usados para manter sessão, preservar
          preferências, proteger o acesso e melhorar o funcionamento do site.
        </p>
      </section>

      <section>
        <h2>6. Anúncios</h2>
        <p>
          O NBA Radar poderá utilizar serviços de anúncios, como Google AdSense. Esses serviços
          podem usar cookies para exibir anúncios personalizados ou medir desempenho, conforme as
          políticas próprias desses provedores.
        </p>
      </section>

      <section>
        <h2>7. Compartilhamento de dados</h2>
        <p>
          O NBA Radar não vende dados pessoais dos usuários. Dados podem ser processados por
          serviços necessários ao funcionamento da plataforma, sempre dentro do escopo técnico da
          aplicação.
        </p>
      </section>

      <section>
        <h2>8. Segurança</h2>
        <p>
          Aplicamos práticas razoáveis de segurança para proteger contas e informações. Ainda
          assim, nenhum sistema digital é totalmente imune a falhas, indisponibilidades ou riscos.
        </p>
      </section>

      <section>
        <h2>9. Direitos do usuário</h2>
        <p>
          Quando aplicável, o usuário pode solicitar alteração, correção ou exclusão de dados
          relacionados à sua conta e preferências.
        </p>
      </section>

      <section>
        <h2>10. Contato</h2>
        <p>
          Dúvidas sobre privacidade podem ser enviadas pela página de{" "}
          <Link href="/contato">contato</Link>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
