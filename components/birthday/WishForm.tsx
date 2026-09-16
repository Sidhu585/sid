"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import type { PublicStats, PublicWish } from "@/types";

interface WishFormProps {
  open: boolean;
  onClose: () => void;
  onWishAdded: (wish: PublicWish, stats: PublicStats) => void;
}

export function WishForm({ open, onClose, onWishAdded }: WishFormProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  const reset = () => {
    setName("");
    setMessage("");
    setErrors({});
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.fieldErrors ?? {});
        showToast(data.error ?? "Something went wrong.", "error");
        return;
      }
      onWishAdded(data.wish as PublicWish, data.stats as PublicStats);
      showToast("Your birthday wish has been added ❤️");
      handleClose();
    } catch {
      showToast("Network error — please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Leave a birthday wish">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="wish-name"
          label="Your name"
          placeholder="e.g. Aman"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          maxLength={60}
          required
        />
        <Textarea
          id="wish-message"
          label="Message"
          placeholder="Happy Birthday bhai ❤️"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          error={errors.message}
          maxLength={240}
          required
        />
        <Button type="submit" size="lg" loading={submitting} className="w-full">
          <Mail className="h-4 w-4" />
          Send wish
        </Button>
      </form>
    </Modal>
  );
}
