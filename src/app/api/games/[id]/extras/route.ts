import { NextRequest, NextResponse } from "next/server";
import { getEspnGameSummary } from "@/integrations/espn/espnAdapter";
import { normalizeEspnGameDetails } from "@/integrations/espn/espnNormalizers";
import {
  findHighlightlyMatchByEspnGame,
  getHighlightlyHeadToHead,
  getHighlightlyLastFiveGames,
  getHighlightlyMatchDetails,
  getHighlightlyMatchHighlights,
  getHighlightlyPredictions
} from "@/integrations/highlightly/highlightlyAdapter";
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

export async function GET(_request: NextRequest, { params }: GameExtrasRouteProps) {
  const { id } = await params;

  try {
    const rawEspnSummary = await getEspnGameSummary(id);
    const espnDetails = normalizeEspnGameDetails(rawEspnSummary);
    const match = await findHighlightlyMatchByEspnGame(espnDetails);

    if (!match) {
      return NextResponse.json({
        data: {
          ...emptyExtras,
          message: "Dados complementares ainda não encontrados na Highlightly.",
          debug: {
            reason: "Match correspondente não encontrado por data e times."
          }
        },
        fallback: false,
        source: "none"
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

    const data: GameExtras = {
      highlights: highlightsResult.status === "fulfilled" ? highlightsResult.value : [],
      prediction: predictionResult.status === "fulfilled" ? predictionResult.value ?? predictionFromDetails : predictionFromDetails,
      headToHead: h2hResult.status === "fulfilled" ? h2hResult.value : null,
      recentForm: {
        home: homeFormResult.status === "fulfilled" ? homeFormResult.value : null,
        visitor: visitorFormResult.status === "fulfilled" ? visitorFormResult.value : null
      },
      source: "highlightly",
      debug: {
        highlightlyMatchId: match.id
      }
    };

    return NextResponse.json({
      data,
      fallback: false,
      source: "highlightly"
    });
  } catch (error) {
    return NextResponse.json({
      data: {
        ...emptyExtras,
        message: "Highlightly indisponível. Dados ESPN continuam funcionando.",
        debug: {
          reason: error instanceof Error ? error.message : "Erro desconhecido na Highlightly."
        }
      },
      fallback: true,
      source: "none",
      message: "Highlightly indisponível. Dados ESPN continuam funcionando."
    });
  }
}
