import { NextRequest, NextResponse } from "next/server";
import { getEspnGameSummary } from "@/integrations/espn/espnAdapter";
import { normalizeEspnHighlights } from "@/integrations/espn/espnHighlights";
import { normalizeEspnGameDetails } from "@/integrations/espn/espnNormalizers";
import {
  getHighlightlyHeadToHead,
  getHighlightlyLastFiveGames,
  getHighlightlyMatchDetails,
  getHighlightlyMatchHighlights,
  getHighlightlyPredictions
} from "@/integrations/highlightly/highlightlyAdapter";
import { findHighlightlyMatchByEspnGameWithDebug } from "@/integrations/highlightly/highlightlyMatchMapper";
import { normalizeHighlightlyPrediction } from "@/integrations/highlightly/highlightlyNormalizers";
import type { GameExtras } from "@/types/gameExtras";

interface GameExtrasRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export const revalidate = 900;

const emptyExtras: GameExtras = {
  highlights: [],
  prediction: null,
  headToHead: null,
  recentForm: {
    home: null,
    visitor: null
  },
  source: "none"
};

function extrasWithEspnHighlights(
  espnHighlights: GameExtras["highlights"],
  message: string,
  debug?: GameExtras["debug"]
): GameExtras {
  return {
    ...emptyExtras,
    highlights: espnHighlights,
    source: espnHighlights.length ? "espn" : "none",
    message,
    debug: {
      espnHighlightsCount: espnHighlights.length,
      ...debug
    }
  };
}

export async function GET(_request: NextRequest, { params }: GameExtrasRouteProps) {
  const { id } = await params;

  try {
    const rawEspnSummary = await getEspnGameSummary(id);
    const espnHighlights = normalizeEspnHighlights(rawEspnSummary);
    const espnDetails = normalizeEspnGameDetails(rawEspnSummary);

    try {
      const lookup = await findHighlightlyMatchByEspnGameWithDebug(espnDetails);
      const match = lookup.match;

      if (!match) {
        const data = extrasWithEspnHighlights(
          espnHighlights,
          espnHighlights.length
            ? "Highlights encontrados via ESPN."
            : "Dados complementares ainda não encontrados na Highlightly.",
          {
            reason: lookup.debug.reason ?? "Match correspondente não encontrado por data e times."
          }
        );

        return NextResponse.json({
          data,
          fallback: false,
          source: data.source
        });
      }

      const homeTeamId = match.homeTeam?.id;
      const awayTeamId = match.awayTeam?.id;

      const [detailsResult, highlightsResult, predictionResult, h2hResult, homeFormResult, visitorFormResult] =
        await Promise.allSettled([
          getHighlightlyMatchDetails(match.id),
          getHighlightlyMatchHighlights(match.id),
          getHighlightlyPredictions(match.id),
          homeTeamId && awayTeamId ? getHighlightlyHeadToHead(homeTeamId, awayTeamId) : Promise.resolve(null),
          homeTeamId ? getHighlightlyLastFiveGames(homeTeamId, match.homeTeam?.name) : Promise.resolve(null),
          awayTeamId ? getHighlightlyLastFiveGames(awayTeamId, match.awayTeam?.name) : Promise.resolve(null)
        ]);

      const matchDetailsRaw = detailsResult.status === "fulfilled" ? detailsResult.value : null;
      const predictionFromDetails = matchDetailsRaw ? normalizeHighlightlyPrediction(matchDetailsRaw) : null;
      const highlightlyHighlights = highlightsResult.status === "fulfilled" ? highlightsResult.value : [];
      const highlights = espnHighlights.length ? espnHighlights : highlightlyHighlights;

      const data: GameExtras = {
        highlights,
        prediction: predictionResult.status === "fulfilled" ? predictionResult.value ?? predictionFromDetails : predictionFromDetails,
        headToHead: h2hResult.status === "fulfilled" ? h2hResult.value : null,
        recentForm: {
          home: homeFormResult.status === "fulfilled" ? homeFormResult.value : null,
          visitor: visitorFormResult.status === "fulfilled" ? visitorFormResult.value : null
        },
        source: espnHighlights.length ? "espn" : "highlightly",
        debug: {
          espnHighlightsCount: espnHighlights.length,
          highlightlyHighlightsCount: highlightlyHighlights.length,
          highlightlyMatchId: match.id,
          lookup: lookup.debug
        }
      };

      return NextResponse.json({
        data,
        fallback: false,
        source: data.source
      });
    } catch (highlightlyError) {
      const data = extrasWithEspnHighlights(
        espnHighlights,
        espnHighlights.length
          ? "Highlightly indisponível. Exibindo highlights encontrados na ESPN."
          : "Highlightly indisponível. Dados ESPN continuam funcionando.",
        {
          reason: highlightlyError instanceof Error ? highlightlyError.message : "Erro desconhecido na Highlightly."
        }
      );

      return NextResponse.json({
        data,
        fallback: true,
        source: data.source,
        message: data.message
      });
    }
  } catch (error) {
    return NextResponse.json({
      data: {
        ...emptyExtras,
        message: "Não foi possível carregar dados complementares agora.",
        debug: {
          reason: error instanceof Error ? error.message : "Erro desconhecido na ESPN."
        }
      },
      fallback: true,
      source: "none",
      message: "Não foi possível carregar dados complementares agora."
    });
  }
}
