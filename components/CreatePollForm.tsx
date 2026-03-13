"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6"
    >
      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Title</span>
        <input
          name="title"
          required
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Description</span>
        <textarea
          name="description"
          rows={4}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-zinc-300">Option A</span>
          <input
            name="optionA"
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-zinc-300">Option B</span>
          <input
            name="optionB"
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 focus:border-orange-500 focus:outline-none"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-zinc-300">Category</span>
          <input
            name="category"
            defaultValue="internet"
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-zinc-300">Duration</span>
          <select
            name="durationMinutes"
            defaultValue={POLL_DURATIONS[1].minutes}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 focus:border-blue-500 focus:outline-none"
          >
            {POLL_DURATIONS.map((duration) => (
              <option key={duration.minutes} value={duration.minutes}>
                {duration.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-500 px-4 py-3 font-semibold text-white transition hover:bg-blue-600"
      >
        Launch argument
      </button>
      {status ? <p className="text-sm text-zinc-400">{status}</p> : null}
    </form>
  );
}
