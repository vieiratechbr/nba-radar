import { NextRequest, NextResponse } from "next/server";
import { getEspnGameSummary } from "@/integrations/espn/espnAdapter";
import { normalizeEspnHighlights } from "@/integrations/espn/espnHighlights";
import { normalizeEspnGameDetails } from "@/integrations/espn/espnNormalizers";
import { getHighlightlyMatchHighlights } from "@/integrations/highlightly/highlightlyAdapter";
import { findHighlightlyMatchByEspnGameWithDebug } from "@/integrations/highlightly/highlightlyMatchMapper";

interface GameHighlightsRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export const revalidate = 900;

export async function GET(_request: NextRequest, { params }: GameHighlightsRouteProps) {
  const { id } = await params;

  try {
    const rawEspnSummary = await getEspnGameSummary(id);
    const espnHighlights = normalizeEspnHighlights(rawEspnSummary);

    if (espnHighlights.length) {
      return NextResponse.json({
        data: espnHighlights,
        source: "espn",
        fallback: false,
        debug: {
          espnEventId: id,
          espnHighlightsCount: espnHighlights.length,
          highlightlyTried: false
        }
      });
    }

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
            fallback: true,
            message: "Highlights encontrados via Highlightly.",
            debug: {
              espnEventId: id,
              espnHighlightsCount: 0,
              highlightlyTried: true,
              highlightlyMatchFound: true,
              highlightlyHighlightsCount: data.length,
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
          espnHighlightsCount: 0,
          highlightlyTried: true,
          highlightlyMatchFound: Boolean(match),
          highlightlyHighlightsCount: 0,
          highlightlyMatchId: match?.id,
          lookup: lookup.debug,
          reason: match
            ? "Match encontrado na Highlightly, mas nenhum vídeo foi retornado para esta partida."
            : lookup.debug.reason
        }
      });
    } catch (highlightlyError) {
      return NextResponse.json({
        data: [],
        source: "none",
        fallback: true,
        message: "Não foi possível carregar melhores momentos agora.",
        debug: {
          espnEventId: id,
          espnHighlightsCount: 0,
          highlightlyTried: true,
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
