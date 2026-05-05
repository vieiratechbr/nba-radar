interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  variant?: "default" | "bulls";
}

export function PageHero({ eyebrow, title, description, variant = "default" }: PageHeroProps) {
  return (
    <section
      className={
        variant === "bulls"
          ? "border-b border-court-red/25 bg-[radial-gradient(circle_at_20%_20%,rgba(215,25,32,0.34),transparent_32rem),#07080b]"
          : "border-b border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_30rem),#07080b]"
      }
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-court-red">
          {eyebrow}
        </p>
        <h1 className="max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
          {description}
        </p>
      </div>
    </section>
  );
}
