import { Sparkles } from "lucide-react";
import type { PublicStats } from "@/types";

interface CelebrationStatsProps {
  stats: PublicStats;
}

export function CelebrationStats({ stats }: CelebrationStatsProps) {
  const { totalCollected, totalContributors, targetAmount } = stats;
  const hasContributions = totalContributors > 0;
  const progressPct = targetAmount
    ? Math.min(100, Math.round((totalCollected / targetAmount) * 100))
    : null;

  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-md rounded-3xl border border-ink-line bg-white-soft p-7 shadow-xl shadow-white/20">
        <div className="mb-2 flex items-center gap-2 text-gold">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-medium tracking-wide">Celebration fund</span>
        </div>

        {hasContributions ? (
          <>
            <p className="mt-3 font-display text-4xl text-paper">
              ₹{totalCollected.toLocaleString("en-IN")}
              {targetAmount && (
                <span className="text-lg text-paper-faint"> / ₹{targetAmount.toLocaleString("en-IN")}</span>
              )}
            </p>
            <p className="mt-1.5 text-sm text-paper-dim">
              collected from {totalContributors} {totalContributors === 1 ? "friend" : "friends"}
            </p>

            {progressPct !== null && (
              <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-ink-line">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold to-blush transition-all duration-700 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            )}
          </>
        ) : (
          <p className="mt-3 text-sm text-paper-dim">Be the first to make the celebration special </p>
        )}
      </div>
    </section>
  );
}
