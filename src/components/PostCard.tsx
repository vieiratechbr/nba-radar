import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, CalendarDays } from "lucide-react";
import type { BlogPost } from "@/types/post";
import { formatDate } from "@/utils/formatDate";

interface PostCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-white/10 bg-court-slate transition duration-300 hover:-translate-y-1 hover:border-court-red/60 hover:shadow-glow">
      <div className={featured ? "relative aspect-[16/8] overflow-hidden bg-zinc-900" : "relative aspect-[16/10] overflow-hidden bg-zinc-900"}>
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes={featured ? "100vw" : "(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"}
          className="object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
        />
      </div>
      <div className="p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
          <span className="rounded-full bg-white/10 px-3 py-1 text-zinc-200">{post.category}</span>
          <span className="text-court-red">{post.readingTime}</span>
        </div>
        <h3 className={featured ? "text-2xl font-black leading-tight text-white" : "text-lg font-black leading-tight text-white"}>
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">{post.summary}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 text-xs text-zinc-500">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {formatDate(post.date)}
          </span>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-white transition hover:text-court-red"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Ler análise
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
