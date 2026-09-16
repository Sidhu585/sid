"use client";

import { useState } from "react";
import { ExternalLink, Heart } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { QRPayment } from "@/components/birthday/QRPayment";
import { useToast } from "@/components/ui/Toast";
import { buildUpiUri } from "@/lib/upi";
import type { PublicStats } from "@/types";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  contributorName: string;
  upiId: string;
  upiName: string;
  onContributed: (stats: PublicStats) => void;
}

type View = "pay" | "confirm" | "done";

export function PaymentModal({
  open,
  onClose,
  amount,
  contributorName,
  upiId,
  upiName,
  onContributed,
}: PaymentModalProps) {
  const [view, setView] = useState<View>("pay");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleClose = () => {
    onClose();
    // Reset after the close transition so the modal doesn't flash content.
    setTimeout(() => {
      setView("pay");
      setMessage("");
      setError(null);
    }, 200);
  };

  const handlePayViaUpi = () => {
    const uri = buildUpiUri({ payeeUpiId: upiId, payeeName: upiName, amount, note: "Birthday gift" });
    window.location.href = uri;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: contributorName, amount, message: message || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        showToast(data.error ?? "Something went wrong.", "error");
        return;
      }
      onContributed(data.stats as PublicStats);
      setView("done");
    } catch {
      showToast("Network error — please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={
        view === "pay" ? `Pay ₹${amount}` : view === "confirm" ? "Confirm your contribution" : "All set"
      }
    >
      {view === "pay" && (
        <div className="flex flex-col gap-6">
          <p className="text-sm text-paper-dim">
            Paying as <span className="font-medium text-paper">{contributorName}</span>
          </p>

          <Button size="lg" onClick={handlePayViaUpi} className="w-full">
            <ExternalLink className="h-4 w-4" />
            Pay ₹{amount} via UPI app
          </Button>

          <div className="flex items-center gap-3 text-xs text-paper-faint">
            <div className="h-px flex-1 bg-ink-line" />
            or scan to pay
            <div className="h-px flex-1 bg-ink-line" />
          </div>

          <QRPayment upiId={upiId} upiName={upiName} amount={amount} />

          <p className="text-center text-xs text-paper-faint">
            We can't automatically confirm UPI payments. Once you've paid, tell us below.
          </p>

          <Button variant="secondary" size="lg" onClick={() => setView("confirm")} className="w-full">
            <Heart className="h-4 w-4" />
            I've paid
          </Button>
        </div>
      )}

      {view === "confirm" && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-sm text-paper-dim">
            This records <span className="font-medium text-paper">{contributorName}</span>'s ₹{amount}{" "}
            contribution for the organizer to verify — it isn't automatic bank confirmation.
          </p>
          <Textarea
            id="contrib-message"
            label="Birthday message (optional)"
            placeholder="Happy Birthday bhai! 🎂"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={240}
          />
          {error && <p className="text-xs text-ember">{error}</p>}
          <Button type="submit" size="lg" loading={submitting} className="w-full">
            Submit contribution
          </Button>
        </form>
      )}

      {view === "done" && (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <Heart className="h-8 w-8 text-gold" />
          <p className="text-paper">Thank you! Your contribution has been recorded.</p>
          <p className="text-xs text-paper-faint">
            It'll show up as verified once the organizer confirms the payment.
          </p>
          <Button variant="secondary" onClick={handleClose} className="mt-2">
            Close
          </Button>
        </div>
      )}
    </Modal>
  );
}
