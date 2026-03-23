"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

type ProfilePoll = {
  id: string;
  title: string;
  status: "ACTIVE" | "CLOSED" | "REMOVED";
  createdAt: string;
  endTime: string;
};

type ProfilePollListProps = {
  initialPolls: ProfilePoll[];
  canManage: boolean;
};

function isClosedPoll(poll: ProfilePoll) {
  return poll.status === "CLOSED" || (poll.status === "ACTIVE" && new Date(poll.endTime) <= new Date());
}

export function ProfilePollList({ initialPolls, canManage }: ProfilePollListProps) {
  const router = useRouter();
  const [polls, setPolls] = useState(initialPolls);
  const [showArchive, setShowArchive] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const visiblePolls = showArchive ? polls : polls.slice(0, 3);

  async function handleDelete(pollId: string) {
    if (!window.confirm("Are you sure you want to delete this poll?")) {
      return;
    }

    setDeletingId(pollId);
    const previousPolls = polls;
    setPolls((current) => current.filter((poll) => poll.id !== pollId));

    try {
      const response = await fetch(`/api/polls/${pollId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Unable to delete poll.");
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      setPolls(previousPolls);
      window.alert(error instanceof Error ? error.message : "Unable to delete poll.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="section-panel p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="panel-title">Recent posts</h3>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowArchive((current) => !current)}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--primary)] transition hover:text-[color:var(--text)]"
          >
            {showArchive ? "Recent" : "Archive"}
          </button>
          <span className="text-sm uppercase tracking-[0.16em] text-[color:var(--muted)]">
            {polls.length} total
          </span>
        </div>
      </div>
      <div
        className={`mt-4 space-y-3 ${showArchive && polls.length > 5 ? "max-h-[29rem] overflow-y-auto pr-2" : ""}`}
      >
        {visiblePolls.length > 0 ? (
          visiblePolls.map((poll) => {
            const isClosed = isClosedPoll(poll);
            const isDeleting = deletingId === poll.id;
            const href = isClosed ? `/result/${poll.id}` : `/poll/${poll.id}`;

            return (
              <div key={poll.id} className="group relative">
                <Link
                  href={href}
                  className="block bg-[color:var(--surface-overlay)] px-4 py-4 pr-12 transition hover:bg-[color:var(--surface-overlay-hover)]"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[color:var(--text)]">
                    {poll.title}
                  </p>
                  <p className="mt-2 text-[0.68rem] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                    Posted {new Date(poll.createdAt).toLocaleDateString()}
                  </p>
                </Link>

                {canManage && isClosed ? (
                  <button
                    type="button"
                    onClick={() => void handleDelete(poll.id)}
                    disabled={isDeleting}
                    aria-label={`Delete ${poll.title}`}
                    className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center bg-[color:var(--surface-high)] text-[color:var(--muted)] opacity-0 transition hover:text-[color:var(--secondary)] disabled:cursor-wait group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            );
          })
        ) : (
          <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]">
            No polls posted yet.
          </p>
        )}
      </div>
    </div>
  );
}
