"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { PollCard } from "@/components/PollCard";
import { ProgressionPanel } from "@/components/ProgressionPanel";
import { ALL_CATEGORY_FILTER, POLL_CATEGORIES } from "@/lib/pollCategories";
import type { ProgressionSummary } from "@/lib/progression";
import type { PollCardData } from "@/lib/types";

type HomeFeedProps = {
  activePolls: PollCardData[];
  progression: ProgressionSummary;
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
          <h2 className="mt-2 font-[var(--font-space)] text-2xl font-bold uppercase tracking-[-0.05em] text-[color:var(--text)] sm:text-3xl">
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

export function HomeFeed({ activePolls, progression, recentPolls }: HomeFeedProps) {
  const [mobileView, setMobileView] = useState<"active" | "recent">("active");
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORY_FILTER);
  const orderedCategories = [...POLL_CATEGORIES].reverse();
  const filteredActivePolls =
    selectedCategory === ALL_CATEGORY_FILTER
      ? activePolls
      : activePolls.filter((poll) => poll.category === selectedCategory);
  const filteredRecentPolls =
    selectedCategory === ALL_CATEGORY_FILTER
      ? recentPolls
      : recentPolls.filter((poll) => poll.category === selectedCategory);

  return (
    <>
      <div className="mb-6 lg:hidden">
        <ProgressionPanel progression={progression} />
      </div>

      <section className="mb-6 space-y-3">
        <div>
          <p className="kicker">Browse by category</p>
          <h2 className="mt-2 font-[var(--font-space)] text-2xl font-bold uppercase tracking-[-0.05em] text-[color:var(--text)]">
            Filter the feed
          </h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[ALL_CATEGORY_FILTER, ...orderedCategories].map((category) => {
            const isActive = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                  isActive
                    ? "bg-[color:var(--surface-high)] text-[color:var(--primary)] neon-shadow-green"
                    : "bg-[color:var(--ghost-bg)] text-[color:var(--muted)] hover:bg-[color:var(--ghost-hover)] hover:text-[color:var(--text)]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex gap-2 sm:hidden">
        <button
          type="button"
          onClick={() => setMobileView("active")}
          className={`flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] ${
            mobileView === "active"
              ? "bg-[color:var(--surface-high)] text-[color:var(--primary)]"
              : "bg-[color:var(--ghost-bg)] text-[color:var(--muted)]"
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
              : "bg-[color:var(--ghost-bg)] text-[color:var(--muted)]"
          }`}
        >
          Closed
        </button>
      </div>

      <section id="feed" className="hidden gap-8 sm:grid xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <FeedSection
          kicker="Open feed"
          heading="Open posts"
          polls={filteredActivePolls}
          statusLabel={`${filteredActivePolls.length} open`}
          emptyMessage={`No open posts in ${selectedCategory === ALL_CATEGORY_FILTER ? "this feed" : selectedCategory}.`}
        />
        <FeedSection
          kicker="Closed feed"
          heading="Recent results"
          polls={filteredRecentPolls}
          statusLabel={`${filteredRecentPolls.length} closed`}
          emptyMessage={`No closed posts in ${selectedCategory === ALL_CATEGORY_FILTER ? "this feed" : selectedCategory}.`}
        />
      </section>

      <section id="feed-mobile" className="space-y-4 sm:hidden">
        {mobileView === "active" ? (
          <FeedSection
            kicker="Open feed"
            heading="Open posts"
            polls={filteredActivePolls}
            statusLabel={`${filteredActivePolls.length} open`}
            emptyMessage={`No open posts in ${selectedCategory === ALL_CATEGORY_FILTER ? "this feed" : selectedCategory}.`}
          />
        ) : (
          <FeedSection
            kicker="Closed feed"
            heading="Recent results"
            polls={filteredRecentPolls}
            statusLabel={`${filteredRecentPolls.length} closed`}
            emptyMessage={`No closed posts in ${selectedCategory === ALL_CATEGORY_FILTER ? "this feed" : selectedCategory}.`}
          />
        )}
      </section>
    </>
  );
}
