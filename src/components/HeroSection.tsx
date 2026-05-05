import Link from "next/link";
import { ArrowRight, Radio, Table2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative isolate min-h-[560px] overflow-hidden border-b border-white/10">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1800&q=80')"
        }}
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,8,11,0.98)_0%,rgba(7,8,11,0.78)_44%,rgba(7,8,11,0.48)_100%)]" />
      <div className="absolute bottom-0 left-0 right-0 -z-10 h-40 bg-gradient-to-t from-court-black to-transparent" />

      <div className="mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-zinc-200">
            <Radio className="h-4 w-4 text-court-red" aria-hidden="true" />
            Placar, classificação e detalhes em tempo de jogo
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[0.95] text-white sm:text-6xl lg:text-7xl">
            Toda a NBA em um só lugar.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
            Acompanhe placares reais, detalhes das partidas, classificação, prêmios e radar do
            Draft em uma central esportiva feita para quem vive basquete.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/placares"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-court-red px-5 py-3 text-sm font-black text-white transition hover:bg-red-600"
            >
              Ver placares
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/classificacao"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:border-white/35 hover:bg-white/[0.08]"
            >
              <Table2 className="h-4 w-4" aria-hidden="true" />
              Ver classificação
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
