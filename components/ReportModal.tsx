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
      <button type="button" onClick={() => setOpen(true)} className="ghost-cta">
        Report Poll
      </button>
    );
  }

  return (
    <div className="shell-panel grid gap-5 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="kicker">Moderation relay</p>
          <h3 className="mt-2 font-[var(--font-space)] text-2xl font-bold uppercase tracking-[-0.04em] text-[color:var(--text)]">
            Report this poll
          </h3>
        </div>
        <button type="button" onClick={() => setOpen(false)} className="ghost-cta px-4 py-2 text-xs">
          Close
        </button>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-5">
        <label className="space-y-2">
          <span className="kicker">Reason</span>
          <select name="reason" className="terminal-field appearance-none">
            {REPORT_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="kicker">Extra context</span>
          <textarea
            name="notes"
            rows={4}
            placeholder="Add evidence for moderators"
            className="terminal-field resize-none"
          />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-4">
          {status ? (
            <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]">{status}</p>
          ) : (
            <span className="text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Report flow unchanged
            </span>
          )}
          <button type="submit" className="secondary-cta min-w-[200px]">
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
}
