"use client";

import { useState } from "react";
import { Gift } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PaymentModal } from "@/components/birthday/PaymentModal";
import { CONTRIBUTION_PRESETS, MAX_CONTRIBUTION, MAX_NAME_LENGTH, MIN_CONTRIBUTION } from "@/lib/config";
import type { PublicStats } from "@/types";

interface ContributionSectionProps {
  name: string;
  upiId: string;
  upiName: string;
  onContributed: (stats: PublicStats) => void;
}

export function ContributionSection({ name, upiId, upiName, onContributed }: ContributionSectionProps) {
  const [contributorName, setContributorName] = useState("");
  const [selected, setSelected] = useState<number>(CONTRIBUTION_PRESETS[1]);
  const [customValue, setCustomValue] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedName = contributorName.trim();
  const nameValid = trimmedName.length > 0 && trimmedName.length <= MAX_NAME_LENGTH;

  const activeAmount = isCustom ? Number(customValue) : selected;
  const isValidAmount =
    Number.isFinite(activeAmount) &&
    Number.isInteger(activeAmount) &&
    activeAmount >= MIN_CONTRIBUTION &&
    activeAmount <= MAX_CONTRIBUTION;

  const handlePresetClick = (amount: number) => {
    setIsCustom(false);
    setSelected(amount);
    setError(null);
  };

  const handleCustomChange = (value: string) => {
    setIsCustom(true);
    setCustomValue(value.replace(/[^\d]/g, ""));
    setError(null);
  };

  const handlePayClick = () => {
    if (!nameValid) {
      setError("Please enter your name first.");
      return;
    }
    if (!isValidAmount) {
      setError(`Enter an amount between ₹${MIN_CONTRIBUTION} and ₹${MAX_CONTRIBUTION}.`);
      return;
    }
    setError(null);
    setModalOpen(true);
  };

  return (
    <section id="contribute" className="scroll-mt-8 px-6 py-8">
      <div className="mx-auto max-w-md rounded-3xl border border-ink-line bg-white p-7 shadow-xl shadow-black/20">
        <div className="mb-2 flex items-center gap-2 text-black">
          <Gift className="h-4 w-4" />
          <span className="text-xs font-medium tracking-wide">Make it special</span>
        </div>
        <h2 className="font-display text-2xl text-gold">Be a part of {name}'s joy</h2>
        <p className="mt-2 text-sm leading-relaxed text-black">
          Enter your name, pick an amount, and send a small gift directly via UPI.
        </p>

        <div className="mt-5">
          <Input
            id="contributor-name"
            label="Your name"
            placeholder="e.g. Sid"
            value={contributorName}
            onChange={(e) => {
              setContributorName(e.target.value);
              setError(null);
            }}
            maxLength={MAX_NAME_LENGTH}
          />
        </div>

        <fieldset disabled={!nameValid} className="mt-5  transition-opacity disabled:opacity">
          <div className="grid grid-cols-4 gap-2">
            {CONTRIBUTION_PRESETS.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handlePresetClick(amount)}
                className={clsx(
                  "rounded-2xl border py-3 text-sm font-medium transition-colors",
                  !isCustom && selected === amount
                    ? "border-gold bg-gold/70 text-black"
                    : "border-ink-line bg-white-soft text-black hover:border-ink-line hover:text-paper"
                )}
              >
                ₹{amount}
              </button>
            ))}
          </div>

          <div className="mt-3">
            <label
              className={clsx(
                "flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm transition-colors",
                isCustom ? "border-gold bg-white" : "border-ink-line bg-white-soft"
              )}
            >
              <span className="text-black">₹</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Custom amount"
                value={customValue}
                onFocus={() => setIsCustom(true)}
                onChange={(e) => handleCustomChange(e.target.value)}
                className="w-full bg-white text-black outline-none placeholder:text-black"
              />
            </label>
          </div>
        </fieldset>

        {error && <p className="mt-3 text-xs text-ember">{error}</p>}
        {!nameValid && !error && (
          <p className="mt-3 text-xs text-black">Add your name above to unlock the amount options.*</p>
        )}

        <Button size="lg" onClick={handlePayClick} className="mt-5 w-full text-black">
          Pay via UPI
        </Button>
      </div>

      <PaymentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        amount={isValidAmount ? activeAmount : selected}
        contributorName={trimmedName}
        upiId={upiId}
        upiName={upiName}
        onContributed={onContributed}
      />
    </section>
  );
}
