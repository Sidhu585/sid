import { getActiveBirthday, getPublicStats, getPublicWishes } from "@/lib/birthday-data";
import { getBirthdayState } from "@/lib/date";
import { BirthdayExperience } from "@/components/birthday/BirthdayExperience";

// Contributions/wishes change whenever someone submits a form, so always
// render this page fresh rather than caching a stale snapshot.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const birthday = await getActiveBirthday();
  const [stats, wishes] = await Promise.all([
    getPublicStats(birthday.id),
    getPublicWishes(birthday.id),
  ]);
  const birthdayState = getBirthdayState(birthday.birthdayMonth, birthday.birthdayDay);

  return (
    <BirthdayExperience
      birthday={birthday}
      birthdayState={birthdayState}
      initialStats={stats}
      initialWishes={wishes}
    />
  );
}
