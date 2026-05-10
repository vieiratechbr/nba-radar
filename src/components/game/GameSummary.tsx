import { Activity, CalendarClock, MapPin, Shield, Trophy } from "lucide-react";
import type { GameDetails } from "@/types/gameDetails";
import { getScheduledStartLabel } from "@/components/game/GameHeader";
import { formatDate } from "@/utils/formatDate";

type GameSummaryProps = {
  details: GameDetails;
};

const statusLabel = {
  live: "Ao vivo",
  final: "Finalizado",
  scheduled: "Agendado"
} as const;

export function GameSummary({ details }: GameSummaryProps) {
  const rows = [
    {
      label: "Status",
      value: statusLabel[details.status],
      icon: <Activity className="h-4 w-4" aria-hidden="true" />
    },
    {
      label: "Data e horário",
      value: details.status === "scheduled" ? getScheduledStartLabel(details.date) : formatDate(details.date),
      icon: <CalendarClock className="h-4 w-4" aria-hidden="true" />
    },
    {
      label: "Arena",
      value: [details.venue, details.city].filter(Boolean).join(", ") || "Arena não informada",
      icon: <MapPin className="h-4 w-4" aria-hidden="true" />
    },
    {
      label: "Mandante",
      value: `${details.homeTeam.fullName}${details.homeTeam.record ? ` · ${details.homeTeam.record}` : ""}`,
      icon: <Shield className="h-4 w-4" aria-hidden="true" />
    },
    {
      label: "Visitante",
      value: `${details.visitorTeam.fullName}${details.visitorTeam.record ? ` · ${details.visitorTeam.record}` : ""}`,
      icon: <Shield className="h-4 w-4" aria-hidden="true" />
    },
    {
      label: "Fonte",
      value: "ESPN",
      icon: <Trophy className="h-4 w-4" aria-hidden="true" />
    }
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {rows.map((row) => (
        <div key={row.label} className="rounded-lg border border-white/10 bg-black/20 p-4 transition hover:border-court-red/35 hover:bg-black/30">
          <div className="mb-3 flex items-center gap-2 text-court-red">
            {row.icon}
            <span className="text-xs font-black uppercase tracking-[0.16em]">{row.label}</span>
          </div>
          <p className="text-sm font-bold leading-6 text-white">{row.value}</p>
        </div>
      ))}
    </div>
  );
}
