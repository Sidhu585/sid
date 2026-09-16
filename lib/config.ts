/**
 * Central, non-secret configuration for the MVP.
 *
 * For the MVP there is exactly one birthday (Siddhant), stored as a single
 * row in the database (see prisma/schema.prisma) with this slug. When more
 * batchmates are added later, this becomes the seed for the first row
 * instead of the only source of truth — the site already reads the active
 * birthday from the database, not from this file, so no rewiring is
 * needed later. This file only holds what's safe to ship to the browser.
 */

export const SITE_CONFIG = {
  siteName: "MCA Birthday",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  timezone: "Asia/Kolkata",
} as const;

export const DEFAULT_BIRTHDAY_SLUG = "sid";

/**
 * Seed data for the one birthday this MVP serves. `getActiveBirthday()`
 * (lib/birthday-data.ts) automatically creates this row in the database
 * the first time the site is opened, so no manual seed script is needed.
 * Edit the values below, then restart the dev server, before your first
 * `npm run db:push`.
 */
export const SEED_BIRTHDAY = {
  slug: DEFAULT_BIRTHDAY_SLUG,
  name: "Sid",
  course: "MCA",
  college: "MANIT Bhopal",
  birthdayMonth: 9, // September
  birthdayDay: 18,
  targetAmount: 3000, // set to null to hide the target and show raised-only
  upiId: process.env.NEXT_PUBLIC_UPI_ID ?? "7850071585-1@ybl",
  upiName: process.env.NEXT_PUBLIC_UPI_NAME ?? "Sid",
};

export const CONTRIBUTION_PRESETS = [50, 100, 150, 200] as const;

export const MIN_CONTRIBUTION = 10;
export const MAX_CONTRIBUTION = 25000;

export const MAX_NAME_LENGTH = 60;
export const MAX_MESSAGE_LENGTH = 240;
