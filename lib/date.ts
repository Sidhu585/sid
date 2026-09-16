/**
 * All birthday date logic is anchored to Asia/Kolkata, never to the
 * visitor's browser timezone — someone opening the link from a different
 * timezone should still see "today" the way it is in Bhopal.
 */

export type BirthdayState = "upcoming" | "today" | "past";

const IST_TIME_ZONE = "Asia/Kolkata";

/** Returns the current wall-clock date/time as it is right now in IST. */
export function nowInIst(): Date {
  const fakeDate = getDevFakeDate();
  const base = fakeDate ?? new Date();
  const istString = base.toLocaleString("en-US", { timeZone: IST_TIME_ZONE });
  return new Date(istString);
}

/**
 * Development-only override so the birthday flow (countdown → live →
 * thank-you) can be previewed without waiting for the real date. Reads
 * NEXT_PUBLIC_DEV_FAKE_DATE ("YYYY-MM-DD"); ignored outside development.
 */
function getDevFakeDate(): Date | null {
  if (process.env.NODE_ENV === "production") return null;
  const raw = process.env.NEXT_PUBLIC_DEV_FAKE_DATE;
  if (!raw) return null;
  const parsed = new Date(`${raw}T12:00:00+05:30`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getBirthdayState(month: number, day: number): BirthdayState {
  const today = nowInIst();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  if (todayMonth === month && todayDay === day) return "today";

  // Compare month/day pairs ignoring year to know if the date already
  // passed this year.
  const asComparable = (m: number, d: number) => m * 100 + d;
  return asComparable(todayMonth, todayDay) > asComparable(month, day) ? "past" : "upcoming";
}

/** Milliseconds remaining until the next occurrence of month/day, IST. */
export function msUntilBirthday(month: number, day: number): number {
  const now = nowInIst();
  let target = new Date(now.getFullYear(), month - 1, day, 0, 0, 0, 0);
  if (target.getTime() < now.getTime()) {
    target = new Date(now.getFullYear() + 1, month - 1, day, 0, 0, 0, 0);
  }
  return target.getTime() - now.getTime();
}

export function formatCountdown(ms: number): { days: number; hours: number; minutes: number } {
  const totalMinutes = Math.max(0, Math.floor(ms / 1000 / 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  return { days, hours, minutes };
}
