"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function DashboardLoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-ink-line bg-ink-soft/90 backdrop-blur p-7 shadow-2xl"
      >
        <div className="mb-5 flex items-center gap-2 text-gold">
          <Lock className="h-4 w-4" />
          <span className="text-xs font-medium tracking-wide">Private dashboard</span>
        </div>
        <h1 className="font-display text-2xl text-paper">Sign in</h1>
        <p className="mt-1 text-sm text-paper-dim">Enter your ID and password to continue.</p>

        <div className="mt-6 flex flex-col gap-4">
          <Input
            id="dashboard-id"
            label="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            autoFocus
            required
          />
          <Input
            id="dashboard-password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error ?? undefined}
            required
          />
        </div>

        <Button type="submit" size="lg" loading={loading} className="mt-5 w-full">
          Sign in
        </Button>
      </form>
    </main>
  );
}
