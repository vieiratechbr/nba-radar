import type { GameDetails } from "@/types/gameDetails";
import type { GameExtras } from "@/types/gameExtras";
import { GameEmptyState } from "@/components/game/GameEmptyState";
import { HighlightVideoCard } from "@/components/highlights/HighlightVideoCard";

type GameHighlightsSectionProps = {
  status: GameDetails["status"];
  highlights: GameExtras["highlights"];
  loading: boolean;
  debugReason?: string;
};

function highlightsEmptyMessage(status: GameDetails["status"]) {
  if (status === "live") return "Melhores momentos serão exibidos após o fim da partida.";
  if (status === "scheduled") return "Melhores momentos ficarão disponíveis após o jogo.";
  return "Melhores momentos ainda não disponíveis.";
}

export function GameHighlightsSection({
  status,
  highlights,
  loading,
  debugReason
}: GameHighlightsSectionProps) {
  if (loading) {
    return <GameEmptyState>Buscando melhores momentos e dados complementares...</GameEmptyState>;
  }

  if (!highlights.length) {
    return (
      <div className="grid gap-2">
        <GameEmptyState>{highlightsEmptyMessage(status)}</GameEmptyState>
        {process.env.NODE_ENV !== "production" && status === "final" && debugReason ? (
          <p className="text-xs font-semibold text-zinc-500">
            ESPN/Highlightly consultadas, mas nenhum vídeo foi encontrado para esta partida. Debug: {debugReason}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {highlights.slice(0, 6).map((highlight) => (
        <HighlightVideoCard key={highlight.id} highlight={highlight} />
      ))}
    </div>
  );
}
