"use client";

import { useState } from "react";
import { BirthdayHero } from "@/components/birthday/BirthdayHero";

import { ContributionSection } from "@/components/birthday/ContributionSection";
import { WishesWall } from "@/components/birthday/WishesWall";
import { WishForm } from "@/components/birthday/WishForm";
import { CelebrationStats } from "@/components/birthday/CelebrationStats";
import { ShareButtons } from "@/components/birthday/ShareButtons";
import type { BirthdayState } from "@/lib/date";
import type { PublicBirthday, PublicStats, PublicWish } from "@/types";

interface BirthdayExperienceProps {
  birthday: PublicBirthday;
  birthdayState: BirthdayState;
  initialStats: PublicStats;
  initialWishes: PublicWish[];
}

export function BirthdayExperience({
  birthday,
  birthdayState,
  initialStats,
  initialWishes,
}: BirthdayExperienceProps) {
  const [stats, setStats] = useState(initialStats);
  const [wishes, setWishes] = useState(initialWishes);
  const [wishModalOpen, setWishModalOpen] = useState(false);

  return (
    <main className="mx-auto min-h-screen max-w-2xl">
      <BirthdayHero
        name={birthday.name}
        course={birthday.course}
        college={birthday.college}
        birthdayMonth={birthday.birthdayMonth}
        birthdayDay={birthday.birthdayDay}
        state={birthdayState}
        onWishClick={() => setWishModalOpen(true)}
      />

     
      <ContributionSection
        name={birthday.name}
        upiId={birthday.upiId}
        upiName={birthday.upiName}
        onContributed={setStats}
      />

      <WishesWall wishes={wishes} />

      <CelebrationStats stats={stats} />

      <ShareButtons name={birthday.name} course={birthday.course} college={birthday.college} />

      <footer className="px-6 pb-8 pt-8 text-center">
        <p className="text-xs text-paper-faint">Made for the MCA family at MANIT Bhopal</p>
        <p className="mt-1 text-[11px] text-paper-faint/70">
          Powered by{" Sid "}
        </p>
      </footer>

      <WishForm
        open={wishModalOpen}
        onClose={() => setWishModalOpen(false)}
        onWishAdded={(wish, updatedStats) => {
          setWishes((prev) => [wish, ...prev]);
          setStats(updatedStats);
        }}
      />
    </main>
  );
}
