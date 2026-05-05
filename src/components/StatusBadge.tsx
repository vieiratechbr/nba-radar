import { clsx } from "clsx";
import type { GameStatus } from "@/types/game";

interface StatusBadgeProps {
  status: GameStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = {
    live: "Ao vivo",
    final: "Finalizado",
    scheduled: "Agendado"
  }[status];

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase",
        status === "live" && "bg-court-red text-white",
        status === "final" && "bg-white/10 text-zinc-200",
        status === "scheduled" && "bg-zinc-800 text-zinc-300"
      )}
    >
      {status === "live" ? <span className="mr-2 h-2 w-2 rounded-full bg-white" /> : null}
      {label}
    </span>
  );
}
