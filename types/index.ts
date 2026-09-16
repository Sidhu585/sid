export type ContributionStatus = "pending" | "verified";

/** Public-safe birthday profile — never includes private contributor data. */
export interface PublicBirthday {
  id: string;
  slug: string;
  name: string;
  course: string;
  college: string;
  birthdayMonth: number;
  birthdayDay: number;
  targetAmount: number | null;
  upiId: string;
  upiName: string;
}

/** Aggregated, privacy-safe celebration stats shown to everyone. */
export interface PublicStats {
  totalCollected: number;
  totalContributors: number;
  totalWishes: number;
  targetAmount: number | null;
}

export interface PublicWish {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

/** Full contribution record — only ever sent to the authenticated dashboard. */
export interface DashboardContribution {
  id: string;
  contributorName: string;
  amount: number;
  message: string | null;
  status: ContributionStatus;
  createdAt: string;
}
