"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";

import { POLL_DURATIONS } from "@/lib/constants";

export function CreatePollForm() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Creating poll...");

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      optionA: String(formData.get("optionA") ?? ""),
      optionB: String(formData.get("optionB") ?? ""),
      category: String(formData.get("category") ?? ""),
      durationMinutes: Number(formData.get("durationMinutes") ?? "5")
    };

    const response = await fetch("/api/polls/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = (await response.json()) as { pollId?: string; error?: string };

    if (!response.ok || !result.pollId) {
      setStatus(result.error ?? "Failed to create poll.");
      return;
    }

    router.push(`/poll/${result.pollId}`);
  }

  return (
    <form onSubmit={handleSubmit} className="shell-panel grid gap-6 p-6 sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[1fr_260px]">
        <div className="space-y-6">
          <label className="block space-y-2">
            <span className="kicker">Argument title</span>
            <input name="title" required className="terminal-field" />
          </label>

          <label className="block space-y-2">
            <span className="kicker">Evidence and context</span>
            <textarea name="description" rows={5} className="terminal-field resize-none" />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="kicker">Option A</span>
              <input name="optionA" required className="terminal-field" />
            </label>
            <label className="space-y-2">
              <span className="kicker">Option B</span>
              <input name="optionB" required className="terminal-field" />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="kicker">Sector</span>
              <input name="category" defaultValue="internet" required className="terminal-field" />
            </label>
            <label className="space-y-2">
              <span className="kicker">Runtime</span>
              <select
                name="durationMinutes"
                defaultValue={POLL_DURATIONS[1].minutes}
                className="terminal-field appearance-none"
              >
                {POLL_DURATIONS.map((duration) => (
                  <option key={duration.minutes} value={duration.minutes}>
                    {duration.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <aside className="grid gap-4">
          <div className="grid-panel p-5">
            <p className="kicker">Launch protocol</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[color:var(--muted)]">
              <li>Keep the judgment binary and unambiguous.</li>
              <li>Context stays optional but should sharpen the debate.</li>
              <li>Duration controls when the reputation loop resolves.</li>
            </ul>
          </div>
          <div className="section-panel p-5">
            <p className="muted-kicker">Flow locked</p>
            <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
              Create poll, route to voting, resolve on deadline, and preserve the existing
              reputation logic exactly as before.
            </p>
          </div>
        </aside>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4">
        {status ? (
          <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]">{status}</p>
        ) : (
          <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]">
            No backend logic changed.
          </p>
        )}
        <button type="submit" className="primary-cta min-w-[240px]">
          Launch Argument
          <Zap className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
