"use client";

import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ShareButtonsProps {
  name: string;
  course: string;
  college: string;
}

// Simple inline WhatsApp glyph so we don't pull in a brand-icon package for one icon.
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.9 11.9L4 20l4.2-1.1a7.9 7.9 0 0 0 3.85 1h.01a7.94 7.94 0 0 0 5.54-13.58ZM12.05 18.4a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.66.67-2.44-.16-.25a6.62 6.62 0 1 1 12.28-3.5 6.58 6.58 0 0 1-6.69 6.6Zm3.62-4.94c-.2-.1-1.17-.58-1.35-.64s-.32-.1-.45.1-.5.64-.62.77-.23.15-.43.05a5.4 5.4 0 0 1-1.6-.99 6 6 0 0 1-1.1-1.37c-.12-.2 0-.3.09-.4s.2-.23.29-.35a1.3 1.3 0 0 0 .2-.33.37.37 0 0 0 0-.35c-.05-.1-.45-1.08-.61-1.48-.16-.38-.33-.33-.45-.34h-.38a.74.74 0 0 0-.53.25 2.24 2.24 0 0 0-.7 1.67 3.9 3.9 0 0 0 .81 2.06 8.9 8.9 0 0 0 3.42 3.02c.48.2.85.33 1.14.42a2.75 2.75 0 0 0 1.26.08 2.06 2.06 0 0 0 1.35-.95 1.68 1.68 0 0 0 .12-.95c-.05-.09-.18-.14-.38-.24Z" />
    </svg>
  );
}

export function ShareButtons({ name, course, college }: ShareButtonsProps) {
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const buildMessage = (url: string) =>
    `🎂 Aaj ${name}'s birthday hai!\n\n${course} • ${college}\n\nUsko wish karo aur birthday celebration me contribute karna ho to yahan karo:\n${url}`;

  const getUrl = () => window.location.href;

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(buildMessage(getUrl()))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: `${name}'s Birthday`,
        text: buildMessage(""),
        url: getUrl(),
      });
    } catch {
      // User cancelled the share sheet — nothing to do.
    }
  };

  return (
    <section className="px-6 py-2">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-ink-line bg-white px-6 py-12 text-center shadow-xl shadow-black/20">
        <h2 className="font-display text-2xl text-gold">Spread the word</h2>
        <p className="text-sm text-black">
          Share this page in the group so nobody misses out.
        </p>
        <div className="mt-1 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button onClick={handleWhatsApp} size="lg" className="w-full sm:w-auto">
            <WhatsAppIcon className="h-4 w-4" />
            Share on WhatsApp
          </Button>
          {canNativeShare && (
            <Button onClick={handleNativeShare} variant="secondary" size="lg" className="w-full sm:w-auto">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
