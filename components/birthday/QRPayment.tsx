"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Check } from "lucide-react";
import { buildUpiUri } from "@/lib/upi";
import { useToast } from "@/components/ui/Toast";

interface QRPaymentProps {
  upiId: string;
  upiName: string;
  amount: number;
}

export function QRPayment({ upiId, upiName, amount }: QRPaymentProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    const uri = buildUpiUri({ payeeUpiId: upiId, payeeName: upiName, amount, note: "Birthday gift" });
    QRCode.toDataURL(uri, {
      width: 260,
      margin: 1,
      color: { dark: "#170F1C", light: "#FBF3EC" },
    }).then((url) => {
      if (!cancelled) setDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [upiId, upiName, amount]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      showToast("UPI ID copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      showToast("Couldn't copy — copy it manually", "error");
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-[220px] w-[220px] items-center justify-center rounded-2xl bg-paper p-3">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dataUrl} alt={`UPI QR code to pay ${upiName}`} className="h-full w-full" />
        ) : (
          <div className="h-full w-full animate-pulse rounded-xl bg-ink-line/40" />
        )}
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-2 rounded-full border border-ink-line bg-ink-soft px-4 py-2 text-xs text-paper-dim transition-colors hover:border-gold/50 hover:text-paper"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-gold" /> : <Copy className="h-3.5 w-3.5" />}
        {upiId}
      </button>
    </div>
  );
}
