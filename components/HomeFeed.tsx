"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { PollCard } from "@/components/PollCard";
import type { PollCardData } from "@/lib/types";

type HomeFeedProps = {
  activePolls: PollCardData[];
  recentPolls: PollCardData[];
};

type FeedSectionProps = {
  emptyMessage: string;
  heading: string;
  kicker: string;
  polls: PollCardData[];
  statusLabel: string;
};

function FeedSection({ emptyMessage, heading, kicker, polls, statusLabel }: FeedSectionProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="kicker">{kicker}</p>
          <h2 className="mt-2 font-[var(--font-space)] text-2xl font-bold uppercase tracking-[-0.05em] text-white sm:text-3xl">
            {heading}
          </h2>
        </div>
        <span className="text-sm uppercase tracking-[0.22em] text-[color:var(--muted)]">
          {statusLabel}
        </span>
      </div>

      <div className="space-y-4">
        {polls.length > 0 ? (
          polls.map((poll) => <PollCard key={poll.id} poll={poll} />)
        ) : (
          <div className="section-panel px-6 py-10 text-sm uppercase tracking-[0.16em] text-[color:var(--muted)]">
            {emptyMessage}
          </div>
        )}
      </div>

      <div className="flex justify-center pt-2">
        <button type="button" className="ghost-cta" onClick={() => router.refresh()}>
          Refresh feed
        </button>
      </div>
    </div>
  );
}

export function HomeFeed({ activePolls, recentPolls }: HomeFeedProps) {
  const [mobileView, setMobileView] = useState<"active" | "recent">("active");

  return (
    <>
      <div className="flex gap-2 sm:hidden">
        <button
          type="button"
          onClick={() => setMobileView("active")}
          className={`flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] ${
            mobileView === "active"
              ? "bg-[color:var(--surface-high)] text-[color:var(--primary)]"
              : "bg-white/[0.04] text-[color:var(--muted)]"
          }`}
        >
          Open
        </button>
        <button
          type="button"
          onClick={() => setMobileView("recent")}
          className={`flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] ${
            mobileView === "recent"
              ? "bg-[color:var(--surface-high)] text-[color:var(--primary)]"
              : "bg-white/[0.04] text-[color:var(--muted)]"
          }`}
        >
          Closed
        </button>
      </div>

      <section id="feed" className="hidden gap-8 sm:grid xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <FeedSection
          kicker="Open feed"
          heading="Open posts"
          polls={activePolls}
          statusLabel={`${activePolls.length} open`}
          emptyMessage="No open posts yet. Start the first one."
        />
        <FeedSection
          kicker="Closed feed"
          heading="Recent results"
          polls={recentPolls}
          statusLabel={`${recentPolls.length} closed`}
          emptyMessage="Closed posts will appear here after people finish voting."
        />
      </section>

      <section id="feed-mobile" className="space-y-4 sm:hidden">
        {mobileView === "active" ? (
          <FeedSection
            kicker="Open feed"
            heading="Open posts"
            polls={activePolls}
            statusLabel={`${activePolls.length} open`}
            emptyMessage="No open posts yet. Start the first one."
          />
        ) : (
          <FeedSection
            kicker="Closed feed"
            heading="Recent results"
            polls={recentPolls}
            statusLabel={`${recentPolls.length} closed`}
            emptyMessage="Closed posts will appear here after people finish voting."
          />
        )}
      </section>
    </>
  );
}
