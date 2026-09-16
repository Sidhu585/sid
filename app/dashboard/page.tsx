import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { DASHBOARD_COOKIE_NAME, verifySessionToken } from "@/lib/dashboard-auth";
import { getActiveBirthday, getPublicStats } from "@/lib/birthday-data";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const dynamic = "force-dynamic";

type ContributionRow = {
  id: string;
  contributorName: string;
  amount: number;
  message: string | null;
  status: string;
  createdAt: Date;
};
type WishRow = { id: string; name: string; message: string; createdAt: Date };

export default async function DashboardPage() {
  const token = cookies().get(DASHBOARD_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    redirect("/dashboard/login");
  }

  const birthday = await getActiveBirthday();
  const [stats, contributions, wishes] = await Promise.all([
    getPublicStats(birthday.id),
    prisma.contribution.findMany({ where: { birthdayId: birthday.id }, orderBy: { createdAt: "desc" } }),
    prisma.wish.findMany({ where: { birthdayId: birthday.id }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <Dashboard
      birthday={birthday}
      initialStats={stats}
      initialContributions={contributions.map((c: ContributionRow) => ({
        id: c.id,
        contributorName: c.contributorName,
        amount: c.amount,
        message: c.message,
        status: c.status as "pending" | "verified",
        createdAt: c.createdAt.toISOString(),
      }))}
      initialWishes={wishes.map((w: WishRow) => ({
        id: w.id,
        name: w.name,
        message: w.message,
        createdAt: w.createdAt.toISOString(),
      }))}
    />
  );
}
