type GameEmptyStateProps = {
  children: string;
};

export function GameEmptyState({ children }: GameEmptyStateProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5 text-sm font-semibold leading-6 text-zinc-400">
      {children}
    </div>
  );
}
