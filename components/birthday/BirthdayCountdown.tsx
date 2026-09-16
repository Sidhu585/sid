"use client";

import { useEffect, useState } from "react";
import { formatCountdown, msUntilBirthday } from "@/lib/date";

interface BirthdayCountdownProps {
  month: number;
  day: number;
}

const UNITS: Array<{ key: "days" | "hours" | "minutes"; label: string }> = [
  { key: "days", label: "days" },
  { key: "hours", label: "hrs" },
  { key: "minutes", label: "min" },
];

export function BirthdayCountdown({ month, day }: BirthdayCountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [remaining, setRemaining] = useState(() => formatCountdown(0));

  useEffect(() => {
    setMounted(true);
    const update = () => setRemaining(formatCountdown(msUntilBirthday(month, day)));
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, [month, day]);

  return (
    <div className="flex items-center justify-center gap-3" aria-live="polite">
      {UNITS.map((unit) => (
        <div
          key={unit.key}
          className="flex min-w-[64px] flex-col items-center rounded-2xl border border-ink-line bg-white-soft px-3 py-2"
        >
          <span className="font-display text-2xl tabular-nums text-paper sm:text-3xl">
            {mounted ? remaining[unit.key] : "--"}
          </span>
          <span className="text-[11px] text-paper-faint">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
