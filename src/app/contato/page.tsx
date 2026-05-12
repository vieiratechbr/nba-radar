import type { Metadata } from "next";
import { Mail, MessageSquare, Send } from "lucide-react";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato sobre o NBA Radar."
};

export default function ContactPage() {
  return (
    <LegalPageLayout
      title="Contato"
      subtitle="Entre em contato sobre o NBA Radar."
    >
      <section>
        <h2>Fale com o projeto</h2>
        <p>
          Para dúvidas, sugestões, parcerias, feedback ou solicitações relacionadas ao NBA Radar,
          utilize os canais informados nesta página.
        </p>
      </section>

      <section>
        <h2>Canais de contato</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-black/20 p-5">
            <Mail className="mb-4 h-5 w-5 text-[var(--team-primary)]" aria-hidden="true" />
            <p className="text-sm font-black text-white">E-mail</p>
            <p className="mt-2 text-sm text-zinc-400">
              Canal oficial em preparação. Configure o e-mail público antes do deploy final.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-5">
            <MessageSquare className="mb-4 h-5 w-5 text-[var(--team-primary)]" aria-hidden="true" />
            <p className="text-sm font-black text-white">Feedback</p>
            <p className="mt-2 text-sm text-zinc-400">
              Sugestões sobre placares, detalhes de jogos, usabilidade e personalização são bem-vindas.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Formulário</h2>
        <p>
          Formulário visual em preparação. Por enquanto, utilize os canais de contato informados.
        </p>
        <form className="mt-5 grid gap-4" aria-label="Formulário visual em preparação">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-zinc-200">
              Nome
              <input
                type="text"
                disabled
                placeholder="Seu nome"
                className="rounded-md border border-white/10 bg-court-black px-4 py-3 text-sm text-zinc-300 outline-none placeholder:text-zinc-600 disabled:opacity-70"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-200">
              E-mail
              <input
                type="email"
                disabled
                placeholder="voce@email.com"
                className="rounded-md border border-white/10 bg-court-black px-4 py-3 text-sm text-zinc-300 outline-none placeholder:text-zinc-600 disabled:opacity-70"
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            Mensagem
            <textarea
              disabled
              placeholder="Escreva sua mensagem"
              rows={5}
              className="resize-none rounded-md border border-white/10 bg-court-black px-4 py-3 text-sm text-zinc-300 outline-none placeholder:text-zinc-600 disabled:opacity-70"
            />
          </label>
          <button
            type="button"
            disabled
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black text-zinc-400 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            Envio em preparação
          </button>
        </form>
      </section>
    </LegalPageLayout>
  );
}
