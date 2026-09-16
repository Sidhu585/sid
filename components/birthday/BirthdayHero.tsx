"use client";

import { Gift, Mail } from "lucide-react";
import { Button, buttonBaseClasses, buttonSizeClasses, buttonVariantClasses } from "@/components/ui/Button";
import clsx from "clsx";
import { BirthdayCountdown } from "@/components/birthday/BirthdayCountdown";
import type { BirthdayState } from "@/lib/date";

interface BirthdayHeroProps {
  name: string;
  course: string;
  college: string;
  birthdayMonth: number;
  birthdayDay: number;
  state: BirthdayState;
  onWishClick: () => void;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const PARTICLES = [
  { left: "12%", top: "22%", size: 4, delay: "0s" },
  { left: "82%", top: "18%", size: 3, delay: "1.4s" },
  { left: "88%", top: "60%", size: 5, delay: "2.6s" },
  { left: "8%", top: "70%", size: 3, delay: "0.8s" },
  { left: "50%", top: "8%", size: 3, delay: "2s" },
];

export function BirthdayHero({
  name,
  course,
  college,
  birthdayMonth,
  birthdayDay,
  state,
  onWishClick,
}: BirthdayHeroProps) {
  const dateLabel = `${birthdayDay} ${MONTH_NAMES[birthdayMonth - 1].toUpperCase()}`;

  return (
    <section className="relative overflow-hidden px-6 pb-4 pt-8 sm:pt-16">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-gold/40 animate-drift"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
            }}
          />
        ))}
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-gold/0 blur-[100px]" />
      </div>

      <div className="relative mx-auto flex max-w-md flex-col items-center text-center">
        <p className="animate-fade-up text-xs font-medium tracking-[0.25em] text-gold">{dateLabel}</p>

        <div className="mt-6 animate-fade-up [animation-delay:80ms]">
          {state === "past" ? (
            <p className="font-display text-3xl text-paper sm:text-4xl">Thank you, {name}'s friends</p>
          ) : (
            <>
              <p className="font-display text-xl text-paper-dim sm:text-2xl">
                {state === "today" ? "Happy Birthday" : "Birthday countdown for"}
              </p>
              <h1 className="font-display-italic mt-1 bg-gradient-to-r from-gold to-blush bg-clip-text text-6xl leading-tight text-transparent sm:text-7xl">
                {name}
              </h1>
            </>
          )}
        </div>

        <p className="mt-5 animate-fade-up text-sm text-paper-dim [animation-delay:160ms]">
          {course} • {college}
        </p>

        <p className="mt-7 max-w-xs animate-fade-up text-[15px] leading-relaxed text-paper-dim [animation-delay:220ms]">
          {state === "today" && `Today is ${name}'s day.`}
          {state === "upcoming" && `Mark the date — something worth celebrating is coming up.`}
          {state === "past" && "Hope you had an amazing birthday. Here's what everyone left behind."}
        </p>

        {state === "upcoming" && (
          <div className="mt-9 animate-fade-up [animation-delay:280ms]">
            <BirthdayCountdown month={birthdayMonth} day={birthdayDay} />
          </div>
        )}

        <div className="mt-10 flex w-full animate-fade-up flex-col gap-3 sm:w-auto sm:flex-row [animation-delay:340ms]">
          <a
            href="#contribute"
            className={clsx(
              buttonBaseClasses,
              buttonVariantClasses.primary,
              buttonSizeClasses.lg,
              "w-full sm:w-auto"
            )}
          >
            <Gift className="h-4 w-4" />
            {state === "past" ? "See the celebration" : "Celebrate the birthday"}
          </a>
          <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={onWishClick}>
            <Mail className="h-4 w-4" />
            Leave a wish
          </Button>
        </div>
      </div>
    </section>
  );
}
