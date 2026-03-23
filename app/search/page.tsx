import Link from "next/link";
import { Search } from "lucide-react";

import { getProfileColor } from "@/lib/profile";
import { searchUsers, searchVisiblePolls } from "@/services/searchService";

export const dynamic = "force-dynamic";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

type PollResult = {
  id: string;
  title: string;
  optionA: string;
  optionB: string;
};

type UserResult = {
  id: string;
  username: string;
  reputation: number;
};

function PollSection({
  emptyMessage,
  heading,
  hrefPrefix,
  label,
  polls
}: {
  emptyMessage: string;
  heading: string;
  hrefPrefix: "/poll/" | "/result/";
  label: "Open" | "Closed";
  polls: PollResult[];
}) {
  return (
    <section className="section-panel p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="panel-title">{heading}</h2>
        <span className="text-sm uppercase tracking-[0.16em] text-[color:var(--muted)]">
          {polls.length} found
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {polls.length > 0 ? (
          polls.map((poll) => (
            <Link
              key={poll.id}
              href={`${hrefPrefix}${poll.id}`}
              className="block bg-[color:var(--surface-overlay)] px-4 py-4 transition hover:bg-[color:var(--surface-overlay-hover)]"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[color:var(--text)]">
                  {poll.title}
                </p>
                <span className="neon-chip status-green shrink-0">{label}</span>
              </div>
              <p className="mt-2 text-[0.68rem] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                {poll.optionA} vs {poll.optionB}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]">
            {emptyMessage}
          </p>
        )}
      </div>
    </section>
  );
}

function UserSection({ users }: { users: UserResult[] }) {
  return (
    <section className="section-panel p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="panel-title">Users</h2>
        <span className="text-sm uppercase tracking-[0.16em] text-[color:var(--muted)]">
          {users.length} found
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {users.length > 0 ? (
          users.map((user) => (
            <Link
              key={user.id}
              href={`/profile/${encodeURIComponent(user.username)}`}
              className="flex items-center gap-4 bg-[color:var(--surface-overlay)] px-4 py-4 transition hover:bg-[color:var(--surface-overlay-hover)]"
            >
              <div className={`h-10 w-10 shrink-0 ${getProfileColor(user.id)}`} aria-hidden="true" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold uppercase tracking-[0.08em] text-[color:var(--text)]">
                  {user.username}
                </p>
                <p className="mt-1 text-[0.68rem] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  Rep {user.reputation}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]">
            No users match this search.
          </p>
        )}
      </div>
    </section>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const [{ openPolls, closedPolls }, users] = query
    ? await Promise.all([searchVisiblePolls(query), searchUsers(query)])
    : [{ openPolls: [], closedPolls: [] }, []];

  return (
    <main className="space-y-6">
      <section className="shell-panel grid gap-5 px-6 py-8 sm:px-8">
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5 text-[color:var(--primary)]" />
          <p className="kicker">Search</p>
        </div>
        <h1 className="font-[var(--font-space)] text-4xl font-bold uppercase tracking-[-0.05em] text-[color:var(--text)] sm:text-5xl">
          Discover polls and profiles
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[color:var(--muted)]">
          {query
            ? `Showing matches for "${query}". Open polls are listed first, then closed polls, then profiles.`
            : "Use the search bar to find live debates, closed results, and user profiles."}
        </p>
      </section>

      {query ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <PollSection
            heading="Open Polls"
            label="Open"
            hrefPrefix="/poll/"
            polls={openPolls}
            emptyMessage="No open polls match this search."
          />
          <PollSection
            heading="Closed Polls"
            label="Closed"
            hrefPrefix="/result/"
            polls={closedPolls}
            emptyMessage="No closed polls match this search."
          />
          <UserSection users={users} />
        </div>
      ) : null}
    </main>
  );
}
