"use client";

import { useState } from "react";

import { REPORT_REASONS } from "@/lib/constants";

type ReportModalProps = {
  pollId: string;
};

export function ReportModal({ pollId }: ReportModalProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Sending report...");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pollId,
        reason: String(formData.get("reason") ?? ""),
        notes: String(formData.get("notes") ?? "")
      })
    });

    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setStatus(result.error ?? "Could not submit report.");
      return;
    }

    setStatus("Report submitted.");
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-500"
      >
        Report Poll
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/95 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Report this poll</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-zinc-400"
        >
          Close
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="reason"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
        >
          {REPORT_REASONS.map((reason) => (
            <option key={reason} value={reason}>
              {reason.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <textarea
          name="notes"
          rows={3}
          placeholder="Extra context"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
        />
        <button
          type="submit"
          className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-600"
        >
          Submit report
        </button>
        {status ? <p className="text-sm text-zinc-400">{status}</p> : null}
      </form>
    </div>
  );
}
