"use client";

import { useState } from "react";

type AdminReport = {
  id: string;
  reason: string;
  status: string;
  createdAt: string;
  poll: {
    id: string;
    title: string;
    status: string;
    creator: {
      username: string;
    };
  };
  reporter: {
    username: string;
  };
};

type AdminReportsProps = {
  reports: AdminReport[];
};

export function AdminReports({ reports: initialReports }: AdminReportsProps) {
  const [reports, setReports] = useState(initialReports);
  const [status, setStatus] = useState<string | null>(null);

  async function handleAction(reportId: string, action: "ignore" | "remove") {
    setStatus("Updating report...");

    const response = await fetch("/api/admin/reports", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ reportId, action })
    });

    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setStatus(result.error ?? "Moderation failed.");
      return;
    }

    setReports((current) =>
      current.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: action === "ignore" ? "REVIEWED" : "RESOLVED",
              poll:
                action === "remove"
                  ? { ...report.poll, status: "REMOVED" }
                  : report.poll
            }
          : report
      )
    );
    setStatus("Moderation action applied.");
  }

  return (
    <div className="space-y-4">
      {status ? <p className="text-sm text-zinc-400">{status}</p> : null}
      {reports.map((report) => (
        <div
          key={report.id}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                {report.reason.replaceAll("_", " ")}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">
                {report.poll.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Creator: {report.poll.creator.username} • Reporter: {report.reporter.username}
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Report status: {report.status} • Poll status: {report.poll.status}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleAction(report.id, "ignore")}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300"
              >
                Ignore
              </button>
              <button
                type="button"
                onClick={() => handleAction(report.id, "remove")}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white"
              >
                Mark Removed
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
