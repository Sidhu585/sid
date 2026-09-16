import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isDashboardRequest } from "@/lib/dashboard-auth";
import { getActiveBirthday, getPublicStats } from "@/lib/birthday-data";

type ContributionRow = {
  id: string;
  contributorName: string;
  amount: number;
  message: string | null;
  status: string;
  createdAt: Date;
};
type WishRow = { id: string; name: string; message: string; createdAt: Date };

export async function GET(req: NextRequest) {
  if (!isDashboardRequest(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const birthday = await getActiveBirthday();
  const [stats, contributions, wishes] = await Promise.all([
    getPublicStats(birthday.id),
    prisma.contribution.findMany({
      where: { birthdayId: birthday.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.wish.findMany({
      where: { birthdayId: birthday.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    birthday,
    stats,
    contributions: contributions.map((c: ContributionRow) => ({
      id: c.id,
      contributorName: c.contributorName,
      amount: c.amount,
      message: c.message,
      status: c.status,
      createdAt: c.createdAt.toISOString(),
    })),
    wishes: wishes.map((w: WishRow) => ({
      id: w.id,
      name: w.name,
      message: w.message,
      createdAt: w.createdAt.toISOString(),
    })),
  });
}
