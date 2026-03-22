"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";

import { DEFAULT_POLL_DURATION_MINUTES, MAX_POLL_DURATION_MINUTES } from "@/lib/constants";

export function CreatePollForm() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [hours, setHours] = useState(String(Math.floor(DEFAULT_POLL_DURATION_MINUTES / 60)));
  const [minutes, setMinutes] = useState(String(DEFAULT_POLL_DURATION_MINUTES % 60));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Creating poll...");

    const formData = new FormData(event.currentTarget);
    const parsedHours = Number(hours || "0");
    const parsedMinutes = Number(minutes || "0");
    const durationMinutes = parsedHours * 60 + parsedMinutes;

    if (
      Number.isNaN(parsedHours) ||
      Number.isNaN(parsedMinutes) ||
      parsedHours < 0 ||
      parsedMinutes < 0 ||
      parsedMinutes > 59 ||
      durationMinutes < 1 ||
      durationMinutes > MAX_POLL_DURATION_MINUTES
    ) {
      setStatus("Runtime must be between 1 minute and 24 hours.");
      return;
    }

    const payload = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      optionA: String(formData.get("optionA") ?? ""),
      optionB: String(formData.get("optionB") ?? ""),
      category: String(formData.get("category") ?? ""),
      durationMinutes
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
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-start">
        <div className="space-y-6">
          <label className="block space-y-2">
            <span className="kicker">Poll title</span>
            <input
              name="title"
              required
              placeholder="Ask the question clearly"
              className="terminal-field text-base font-medium tracking-[0.04em]"
            />
          </label>

          <label className="block space-y-2">
            <span className="kicker">Context</span>
            <textarea
              name="description"
              rows={5}
              placeholder="Add the context people need before voting."
              className="terminal-field resize-none text-base leading-7"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="kicker">Option A</span>
              <input
                name="optionA"
                required
                placeholder="First outcome"
                className="terminal-field text-base font-medium tracking-[0.04em]"
              />
            </label>
            <label className="space-y-2">
              <span className="kicker">Option B</span>
              <input
                name="optionB"
                required
                placeholder="Second outcome"
                className="terminal-field text-base font-medium tracking-[0.04em]"
              />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="kicker">Category</span>
              <input
                name="category"
                defaultValue="internet"
                required
                className="terminal-field text-base font-medium tracking-[0.04em]"
              />
            </label>
            <label className="space-y-2">
              <span className="kicker">Runtime (max 24 hours)</span>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min="0"
                  max="24"
                  inputMode="numeric"
                  value={hours}
                  onChange={(event) => setHours(event.target.value)}
                  className="terminal-field text-base font-medium tracking-[0.04em]"
                  placeholder="Hours"
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  inputMode="numeric"
                  value={minutes}
                  onChange={(event) => setMinutes(event.target.value)}
                  className="terminal-field text-base font-medium tracking-[0.04em]"
                  placeholder="Minutes"
                />
              </div>
            </label>
          </div>
        </div>

        <aside className="grid gap-4 self-start">
          <div className="section-panel p-5">
            <p className="kicker">Posting Guide</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[color:var(--muted)]">
              <li>Keep the choice binary and easy to read.</li>
              <li>Context is optional, but good context improves replies and votes.</li>
              <li>No hate, violence, or personal attacks.</li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-subtle pt-4">
        {status ? (
          <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]">{status}</p>
        ) : (
          <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Keep it civil and avoid hate, threats, or personal attacks.
          </p>
        )}
        <button type="submit" className="primary-cta min-w-[240px]">
          Post Poll
          <Zap className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
