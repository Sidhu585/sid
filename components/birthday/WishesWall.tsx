import { MessageCircleHeart } from "lucide-react";
import type { PublicWish } from "@/types";

interface WishesWallProps {
  wishes: PublicWish[];
}

export function WishesWall({ wishes }: WishesWallProps) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-md">
        <div className="mb-2 flex items-center gap-2 text-gold">
          <MessageCircleHeart className="h-4 w-4" />
          <span className="text-xs font-medium tracking-wide">Birthday wishes</span>
        </div>
        <h2 className="font-display text-2xl text-paper">What everyone's saying</h2>

        {wishes.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-ink-line px-5 py-10 text-center shadow-xl shadow-gold/20">
            <p className="text-sm text-paper-dim">Be the first to leave a birthday wish 💌</p>
          </div>
        ) : (
          <ul className="mt-6 flex flex-col gap-3">
            {wishes.map((wish) => (
              <li
                key={wish.id}
                className="rounded-2xl border border-ink-line bg-ink-soft px-5 py-4"
              >
                <p className="text-[15px] leading-relaxed text-paper">{wish.message}</p>
                <p className="mt-2.5 text-xs font-medium text-gold">{wish.name}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
