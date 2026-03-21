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
      {status ? (
        <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]">{status}</p>
      ) : null}
      {reports.map((report) => (
        <div key={report.id} className="shell-panel grid gap-5 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <span className="neon-chip status-purple">{report.reason.replaceAll("_", " ")}</span>
              <h3 className="font-[var(--font-space)] text-2xl font-bold uppercase tracking-[-0.04em] text-white">
                {report.poll.title}
              </h3>
              <div className="grid gap-1 text-sm uppercase tracking-[0.14em] text-[color:var(--muted)]">
                <p>Creator: {report.poll.creator.username}</p>
                <p>Reporter: {report.reporter.username}</p>
                <p>Report status: {report.status}</p>
                <p>Poll status: {report.poll.status}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleAction(report.id, "ignore")}
                className="ghost-cta"
              >
                Ignore
              </button>
              <button
                type="button"
                onClick={() => handleAction(report.id, "remove")}
                className="secondary-cta"
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
