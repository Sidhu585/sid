"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Trash2, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import type { DashboardContribution, PublicBirthday, PublicStats, PublicWish } from "@/types";

interface DashboardProps {
  birthday: PublicBirthday;
  initialStats: PublicStats;
  initialContributions: DashboardContribution[];
  initialWishes: PublicWish[];
}

export function Dashboard({
  birthday,
  initialStats,
  initialContributions,
  initialWishes,
}: DashboardProps) {
  const [contributions, setContributions] = useState(initialContributions);
  const [wishes, setWishes] = useState(initialWishes);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { showToast } = useToast();
  const router = useRouter();

  const verifiedTotal = contributions
    .filter((c) => c.status === "verified")
    .reduce((sum, c) => sum + c.amount, 0);

  const handleLogout = async () => {
    await fetch("/api/dashboard/logout", { method: "POST" });
    router.push("/dashboard/login");
    router.refresh();
  };

  const toggleStatus = async (contribution: DashboardContribution) => {
    const nextStatus = contribution.status === "pending" ? "verified" : "pending";
    setBusyId(contribution.id);
    try {
      const res = await fetch(`/api/dashboard/contributions/${contribution.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error();
      setContributions((prev) =>
        prev.map((c) => (c.id === contribution.id ? { ...c, status: nextStatus } : c))
      );
    } catch {
      showToast("Couldn't update status.", "error");
    } finally {
      setBusyId(null);
    }
  };

  const deleteContribution = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/dashboard/contributions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setContributions((prev) => prev.filter((c) => c.id !== id));
      showToast("Contribution removed.");
    } catch {
      showToast("Couldn't remove that entry.", "error");
    } finally {
      setBusyId(null);
    }
  };

  const deleteWish = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/dashboard/wishes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setWishes((prev) => prev.filter((w) => w.id !== id));
      showToast("Wish removed.");
    } catch {
      showToast("Couldn't remove that wish.", "error");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-wide text-gold">Private dashboard</p>
          <h1 className="mt-1 font-display text-2xl text-paper">
            {birthday.name} — {birthday.birthdayDay}/{birthday.birthdayMonth}
          </h1>
        </div>
        <Button variant="ghost" size="md" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total collected", value: `₹${initialStats.totalCollected.toLocaleString("en-IN")}` },
          { label: "Verified amount", value: `₹${verifiedTotal.toLocaleString("en-IN")}` },
          { label: "Contributors", value: contributions.length },
          { label: "Wishes", value: wishes.length },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-ink-line bg-ink-soft p-4">
            <p className="text-xs text-paper-faint">{stat.label}</p>
            <p className="mt-1 font-display text-xl text-paper">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="mb-3 font-display text-lg text-paper">Contributions</h2>
        {contributions.length === 0 ? (
          <p className="text-sm text-paper-dim">No contributions yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {contributions.map((c) => (
              <div
                key={c.id}
                className="flex flex-col gap-2 rounded-2xl border border-ink-line bg-ink-soft p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-paper">{c.contributorName}</p>
                    <span className="text-sm text-paper-dim">₹{c.amount}</span>
                  </div>
                  {c.message && <p className="mt-0.5 truncate text-xs text-paper-faint">{c.message}</p>}
                  <p className="mt-0.5 text-[11px] text-paper-faint">
                    {new Date(c.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => toggleStatus(c)}
                    disabled={busyId === c.id}
                    className={
                      c.status === "verified"
                        ? "flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold"
                        : "flex items-center gap-1.5 rounded-full bg-ink-line/50 px-3 py-1.5 text-xs font-medium text-paper-dim"
                    }
                  >
                    {c.status === "verified" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Circle className="h-3.5 w-3.5" />
                    )}
                    {c.status}
                  </button>
                  <button
                    onClick={() => deleteContribution(c.id)}
                    disabled={busyId === c.id}
                    aria-label="Delete contribution"
                    className="rounded-full p-2 text-paper-faint hover:bg-ember/10 hover:text-ember"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 font-display text-lg text-paper">Wishes</h2>
        {wishes.length === 0 ? (
          <p className="text-sm text-paper-dim">No wishes yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {wishes.map((w) => (
              <div
                key={w.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-ink-line bg-ink-soft p-4"
              >
                <div className="min-w-0">
                  <p className="text-sm text-paper">{w.message}</p>
                  <p className="mt-1 text-xs font-medium text-gold">{w.name}</p>
                </div>
                <button
                  onClick={() => deleteWish(w.id)}
                  disabled={busyId === w.id}
                  aria-label="Delete wish"
                  className="shrink-0 rounded-full p-2 text-paper-faint hover:bg-ember/10 hover:text-ember"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
