import Image from "next/image";
import { ArrowUpRight, CalendarDays, Newspaper } from "lucide-react";
import type { NewsArticle } from "@/types/news";
import { formatDate } from "@/utils/formatDate";

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const description =
    article.summary ?? article.description ?? "Resumo indisponível na fonte original.";
  const publishedDate = article.date ?? article.publishedAt ?? new Date().toISOString();
  const articleUrl = article.externalUrl ?? article.url ?? "#";

  return (
    <article className="group overflow-hidden rounded-lg border border-white/10 bg-court-slate transition duration-300 hover:-translate-y-1 hover:border-court-red/60 hover:shadow-glow">
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        ) : (
          <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_center,rgba(215,25,32,0.25),transparent_34%),#111217] text-court-red">
            <Newspaper className="h-12 w-12" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
          <span className="rounded-full bg-court-red/15 px-3 py-1 text-court-red">
            {article.category}
          </span>
          <span className="text-zinc-500">{article.source}</span>
        </div>
        <h3 className="text-lg font-black leading-tight text-white">{article.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">{description}</p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 text-xs text-zinc-500">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {formatDate(publishedDate)}
          </span>
          <a
            href={articleUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-white transition hover:text-court-red"
          >
            Ler notícia
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
