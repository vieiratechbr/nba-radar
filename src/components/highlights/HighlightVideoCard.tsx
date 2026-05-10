"use client";

import Image from "next/image";
import { ExternalLink, Play } from "lucide-react";
import type { GameHighlight } from "@/types/highlight";
import {
  getBestVideoDisplayMode,
  getVideoSourceUrl
} from "@/utils/videoEmbed";

type HighlightVideoCardProps = {
  highlight: GameHighlight;
};

export function HighlightVideoCard({ highlight }: HighlightVideoCardProps) {
  const displayMode = getBestVideoDisplayMode(highlight);
  const sourceUrl = getVideoSourceUrl(highlight);
  const externalUrl = highlight.videoUrl ?? highlight.embedUrl ?? "#";

  return (
    <article className="group overflow-hidden rounded-md border border-white/10 bg-black/20 transition hover:border-court-red/60 hover:bg-black/35">
      <div className="relative aspect-video bg-court-black">
        {displayMode === "iframe" ? (
          <iframe
            src={sourceUrl}
            title={highlight.title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="h-full w-full"
          />
        ) : null}

        {displayMode === "video" ? (
          <video
            controls
            preload="metadata"
            poster={highlight.thumbnailUrl}
            className="h-full w-full bg-black object-contain"
          >
            <source src={sourceUrl} type="video/mp4" />
          </video>
        ) : null}

        {displayMode === "external" ? (
          <>
            {highlight.thumbnailUrl ? (
              <Image
                src={highlight.thumbnailUrl}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover opacity-90 transition group-hover:opacity-100"
              />
            ) : (
              <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_top,rgba(215,25,32,0.28),transparent_45%),#101116]">
                <Play className="h-9 w-9 text-court-red" aria-hidden="true" />
              </div>
            )}
            <a
              href={externalUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-black/75 px-3 py-1 text-xs font-black text-white transition hover:text-court-red"
            >
              <Play className="h-3.5 w-3.5 text-court-red" aria-hidden="true" />
              Abrir vídeo
            </a>
          </>
        ) : null}
      </div>

      <div className="p-4">
        <p className="text-sm font-black text-white">{highlight.title}</p>
        {highlight.description ? (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-400">{highlight.description}</p>
        ) : null}
        {displayMode === "external" ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-court-red"
          >
            Assistir na fonte original
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : (
          <span className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-court-red">
            Fonte original · {highlight.source.toUpperCase()}
          </span>
        )}
      </div>
    </article>
  );
}
