import { redirect } from "next/navigation";

import { AdminReports } from "@/components/AdminReports";
import { auth, isAdminEmail } from "@/lib/auth";
import { listReports } from "@/services/reportService";

export const dynamic = "force-dynamic";

export default async function ModerationPage() {
  const session = await auth();

  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    redirect("/login?callbackUrl=/admin/moderation");
  }

  const reports = await listReports();

  return (
    <main className="space-y-6">
      <section className="shell-panel grid gap-5 px-6 py-8 sm:px-8">
        <p className="kicker">Moderation relay</p>
        <h1 className="font-[var(--font-space)] text-5xl font-bold uppercase leading-[0.94] tracking-[-0.06em] text-[color:var(--text)] sm:text-6xl">
          Reported polls
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[color:var(--muted)]">
          Review abuse signals, ignore low-quality noise, and keep the current moderation workflow
          intact.
        </p>
      </section>
      <AdminReports
        reports={reports.map((report) => ({
          id: report.id,
          reason: String(report.reason),
          status: String(report.status),
          createdAt: report.createdAt.toISOString(),
          poll: {
            id: report.poll.id,
            title: report.poll.title,
            status: String(report.poll.status),
            creator: {
              username: report.poll.creator.username
            }
          },
          reporter: {
            username: report.reporter.username
          }
        }))}
      />
    </main>
  );
}
