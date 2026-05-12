import Image from "next/image";
import Link from "next/link";
import { LayoutWrapper } from "@/components/LayoutWrapper";

const navigationLinks = [
  { href: "/", label: "Início" },
  { href: "/placares", label: "Placares" },
  { href: "/classificacao", label: "Classificação" },
  { href: "/premios", label: "Prêmios" },
  { href: "/draft", label: "Draft" }
];

const institutionalLinks = [
  { href: "/sobre", label: "Sobre" },
  { href: "/privacidade", label: "Política de Privacidade" },
  { href: "/termos", label: "Termos de Uso" },
  { href: "/contato", label: "Contato" }
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black/30">
      <LayoutWrapper className="grid gap-10 py-10 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link
            href="/"
            className="mb-4 inline-flex items-center rounded-lg border border-white/10 bg-white/95 px-2 py-1 transition hover:bg-white"
          >
            <Image
              src="/logos/logotext.png"
              alt="NBA Radar"
              width={144}
              height={144}
              className="h-12 w-auto object-contain"
            />
          </Link>
          <p className="max-w-xl text-sm leading-6 text-zinc-400">
            Central independente para acompanhar placares, classificação, prêmios, draft e detalhes
            de jogos da NBA com dados reais da ESPN quando disponíveis.
          </p>
          <p className="mt-4 text-xs leading-5 text-zinc-500">
            Projeto independente de estudos e portfólio. Sem afiliação oficial com a NBA.
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
            Navegação
          </p>
          <div className="grid gap-3">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-zinc-400 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
            Institucional
          </p>
          <div className="grid gap-3">
            {institutionalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-zinc-400 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </LayoutWrapper>
    </footer>
  );
}
