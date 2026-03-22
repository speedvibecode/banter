import Link from "next/link";
import { notFound } from "next/navigation";

import { getProfileColor, getReputationCategory } from "@/lib/profile";
import { getUserByUsername } from "@/services/userService";

export const dynamic = "force-dynamic";

type ProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const user = await getUserByUsername(decodeURIComponent(username));

  if (!user) {
    notFound();
  }

  const profileColor = getProfileColor(user.id);
  const reputationCategory = getReputationCategory(user.reputation);

  return (
    <main className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="shell-panel p-6">
          <div className={`h-56 w-full ${profileColor}`} aria-hidden="true" />
          <div className="mt-6">
            <p className="kicker">Profile</p>
            <h1 className="mt-3 font-[var(--font-space)] text-5xl font-bold uppercase tracking-[-0.06em] text-white">
              {user.username}
            </h1>
            <p className="mt-2 text-sm uppercase tracking-[0.24em] text-[color:var(--secondary)]">
              {reputationCategory}
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="bg-surface-low px-4 py-4">
              <p className="muted-kicker">Reputation</p>
              <p className="mt-2 text-3xl font-bold text-[color:var(--primary)]">{user.reputation}</p>
            </div>
            <div className="bg-surface-low px-4 py-4">
              <p className="muted-kicker">Polls created</p>
              <p className="mt-2 text-3xl font-bold text-white">{user.pollsCreated}</p>
            </div>
            <div className="bg-surface-low px-4 py-4">
              <p className="muted-kicker">Polls answered</p>
              <p className="mt-2 text-3xl font-bold text-white">{user.pollsParticipated}</p>
            </div>
          </div>
        </div>

        <div className="shell-panel grid gap-5 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="kicker">Activity</p>
              <h2 className="mt-2 font-[var(--font-space)] text-3xl font-bold uppercase tracking-[-0.05em] text-white">
                Recent history
              </h2>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="section-panel p-5">
              <div className="flex items-center justify-between">
                <h3 className="panel-title">Recent posts</h3>
                <span className="text-sm uppercase tracking-[0.16em] text-[color:var(--muted)]">
                  {user.pollsCreated} total
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {user.polls.length > 0 ? (
                  user.polls.map((poll) => (
                    <Link
                      key={poll.id}
                      href={poll.status === "CLOSED" ? `/result/${poll.id}` : `/poll/${poll.id}`}
                      className="block bg-black/20 px-4 py-4 transition hover:bg-white/[0.04]"
                    >
                      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-white">
                        {poll.title}
                      </p>
                      <p className="mt-2 text-[0.68rem] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                        Posted {poll.createdAt.toLocaleDateString()}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]">
                    No polls posted yet.
                  </p>
                )}
              </div>
            </div>

            <div className="section-panel p-5">
              <div className="flex items-center justify-between">
                <h3 className="panel-title">Recent votes</h3>
                <span className="text-sm uppercase tracking-[0.16em] text-[color:var(--muted)]">
                  {user.pollsParticipated} total
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {user.votes.length > 0 ? (
                  user.votes.map((vote) => (
                    <Link
                      key={vote.id}
                      href={
                        vote.poll.status === "CLOSED"
                          ? `/result/${vote.poll.id}`
                          : `/poll/${vote.poll.id}`
                      }
                      className="block bg-black/20 px-4 py-4 transition hover:bg-white/[0.04]"
                    >
                      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-white">
                        {vote.poll.title}
                      </p>
                      <p className="mt-2 text-[0.68rem] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                        Answered {vote.createdAt.toLocaleDateString()}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]">
                    No answered polls yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
