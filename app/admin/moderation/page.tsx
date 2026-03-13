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
    <main className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-orange-400">
          Moderation
        </p>
        <h1 className="mt-2 text-3xl font-bold">Reported polls</h1>
        <p className="mt-3 text-zinc-400">
          Review reports, ignore noise, and mark abusive polls as removed.
        </p>
      </div>
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
