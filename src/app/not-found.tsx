import Link from "next/link";
import { LayoutWrapper } from "@/components/LayoutWrapper";

export default function NotFound() {
  return (
    <LayoutWrapper className="py-20 text-center">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-court-red">404</p>
      <h1 className="mt-3 text-4xl font-black text-white">Página não encontrada</h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-400">
        O conteúdo solicitado não existe ou ainda não foi publicado no NBA Radar.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-md bg-court-red px-5 py-3 text-sm font-black text-white transition hover:bg-red-600"
      >
        Voltar ao início
      </Link>
    </LayoutWrapper>
  );
}
