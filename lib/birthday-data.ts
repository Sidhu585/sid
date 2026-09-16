import { prisma } from "./db";
import { DEFAULT_BIRTHDAY_SLUG, SEED_BIRTHDAY } from "./config";
import type { PublicBirthday, PublicStats, PublicWish } from "@/types";

type WishRow = { id: string; name: string; message: string; createdAt: Date };

/**
 * Fetches the active birthday row, auto-seeding it on first run so the
 * site works immediately after `prisma db push` without a separate seed
 * step. Multiple birthdays can exist later — this simply picks the one
 * this MVP is configured to show.
 */
export async function getActiveBirthday(): Promise<PublicBirthday> {
  let birthday = await prisma.birthday.findUnique({
    where: { slug: DEFAULT_BIRTHDAY_SLUG },
  });

  if (!birthday) {
    birthday = await prisma.birthday.create({ data: SEED_BIRTHDAY });
  }

  return {
    id: birthday.id,
    slug: birthday.slug,
    name: birthday.name,
    course: birthday.course,
    college: birthday.college,
    birthdayMonth: birthday.birthdayMonth,
    birthdayDay: birthday.birthdayDay,
    targetAmount: birthday.targetAmount,
    upiId: birthday.upiId,
    upiName: birthday.upiName,
  };
}

/**
 * Public, aggregated-only celebration stats. Counts every contribution
 * that hasn't been removed as spam, regardless of pending/verified status,
 * so the shared progress feels alive through the day — the verified flag
 * is a private trust marker for the organizer, not a gate on the public
 * counter. Individual names/amounts are never included here.
 */
export async function getPublicStats(birthdayId: string): Promise<PublicStats> {
  const [aggregate, wishCount, birthday] = await Promise.all([
    prisma.contribution.aggregate({
      where: { birthdayId },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.wish.count({ where: { birthdayId } }),
    prisma.birthday.findUnique({ where: { id: birthdayId }, select: { targetAmount: true } }),
  ]);

  return {
    totalCollected: aggregate._sum.amount ?? 0,
    totalContributors: aggregate._count._all,
    totalWishes: wishCount,
    targetAmount: birthday?.targetAmount ?? null,
  };
}

export async function getPublicWishes(birthdayId: string, take = 50): Promise<PublicWish[]> {
  const wishes = await prisma.wish.findMany({
    where: { birthdayId },
    orderBy: { createdAt: "desc" },
    take,
  });

  return wishes.map((w: WishRow) => ({
    id: w.id,
    name: w.name,
    message: w.message,
    createdAt: w.createdAt.toISOString(),
  }));
}
