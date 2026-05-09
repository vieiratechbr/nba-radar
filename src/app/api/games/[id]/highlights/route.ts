import { NextRequest, NextResponse } from "next/server";
import { getEspnGameSummary } from "@/integrations/espn/espnAdapter";
import { normalizeEspnGameDetails } from "@/integrations/espn/espnNormalizers";
import { getHighlightlyMatchHighlights } from "@/integrations/highlightly/highlightlyAdapter";
import { findHighlightlyMatchByEspnGameWithDebug } from "@/integrations/highlightly/highlightlyMatchMapper";
import type { GameHighlight } from "@/types/highlight";

interface GameHighlightsRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export const revalidate = 900;

function normalizeEspnHighlights(raw: unknown): GameHighlight[] {
  const record = typeof raw === "object" && raw !== null ? raw as Record<string, unknown> : {};
  const videos = Array.isArray(record.videos) ? record.videos : [];

  return videos.flatMap((video, index) => {
    if (typeof video !== "object" || video === null) return [];
    const row = video as Record<string, unknown>;
    const links = typeof row.links === "object" && row.links !== null ? row.links as Record<string, unknown> : {};
    const web = typeof links.web === "object" && links.web !== null ? links.web as Record<string, unknown> : {};
    const href = typeof web.href === "string" ? web.href : "";
    if (!href || !href.startsWith("https://")) return [];

    return [{
      id: typeof row.id === "string" ? row.id : `espn-video-${index}`,
      title: typeof row.headline === "string" ? row.headline : "Melhores momentos",
      description: typeof row.description === "string" ? row.description : undefined,
      thumbnailUrl: typeof row.thumbnail === "string" ? row.thumbnail : undefined,
      videoUrl: href,
      source: "espn" as const,
      publishedAt: typeof row.date === "string" ? row.date : undefined,
      isEmbeddable: false
    }];
  });
}

export async function GET(_request: NextRequest, { params }: GameHighlightsRouteProps) {
  const { id } = await params;

  try {
    const rawEspnSummary = await getEspnGameSummary(id);
    const espnDetails = normalizeEspnGameDetails(rawEspnSummary);

    try {
      const lookup = await findHighlightlyMatchByEspnGameWithDebug(espnDetails);
      const match = lookup.match;

      if (match) {
        const data = await getHighlightlyMatchHighlights(match.id);

        if (data.length) {
          return NextResponse.json({
            data,
            source: "highlightly",
            fallback: false,
            debug: {
              espnEventId: id,
              highlightlyMatchId: match.id,
              lookup: lookup.debug
            }
          });
        }
      }

      return NextResponse.json({
        data: [],
        source: "none",
        fallback: false,
        message: "Melhores momentos ainda não disponíveis.",
        debug: {
          espnEventId: id,
          highlightlyMatchId: match?.id,
          lookup: lookup.debug,
          reason: match
            ? "Match encontrado na Highlightly, mas nenhum vídeo foi retornado para esta partida."
            : lookup.debug.reason
        }
      });
    } catch (highlightlyError) {
      const espnHighlights = normalizeEspnHighlights(rawEspnSummary);

      if (espnHighlights.length) {
        return NextResponse.json({
          data: espnHighlights,
          source: "espn",
          fallback: true,
          message: "Highlightly indisponível. Exibindo vídeos encontrados na ESPN.",
          debug: {
            espnEventId: id,
            reason: highlightlyError instanceof Error ? highlightlyError.message : "Erro desconhecido na Highlightly."
          }
        });
      }

      return NextResponse.json({
        data: [],
        source: "none",
        fallback: true,
        message: "Não foi possível carregar melhores momentos agora.",
        debug: {
          espnEventId: id,
          reason: highlightlyError instanceof Error ? highlightlyError.message : "Erro desconhecido na Highlightly."
        }
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        data: [],
        source: "none",
        fallback: true,
        message: "Não foi possível carregar melhores momentos agora.",
        debug: {
          espnEventId: id,
          reason: error instanceof Error ? error.message : "Erro desconhecido."
        }
      },
      { status: 502 }
    );
  }
}
