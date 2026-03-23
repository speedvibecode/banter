import Link from "next/link";
import { notFound } from "next/navigation";

import { ResultFeedbackCard } from "@/components/ResultFeedbackCard";
import { ResultCard } from "@/components/ResultCard";
import { auth } from "@/lib/auth";
import { getPoll, resolvePoll } from "@/services/pollService";
import { getUserProgression } from "@/services/progressionService";

export const dynamic = "force-dynamic";

type ResultPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params;
  const session = await auth();
  let poll = await getPoll(id);

  if (!poll) {
    notFound();
  }

  if (poll.status === "ACTIVE" && poll.endTime <= new Date()) {
    await resolvePoll(poll.id);
    poll = await getPoll(id);
  }

  if (!poll || !poll.winner) {
    notFound();
  }

  const viewerVote = session?.user ? poll.votes.find((vote) => vote.userId === session.user.id) : null;
  const progression = session?.user?.id ? await getUserProgression(session.user.id) : null;

  return (
    <main className="space-y-6">
      <section className="shell-panel grid gap-5 px-6 py-8 sm:px-8">
        <p className="kicker">Poll result</p>
        <h1 className="font-[var(--font-space)] text-5xl font-bold uppercase leading-[0.94] tracking-[-0.06em] text-[color:var(--text)] sm:text-6xl">
          Final result
        </h1>
      </section>

      <ResultCard
        title={poll.title}
        optionA={poll.optionA}
        optionB={poll.optionB}
        totalA={poll.totalA}
        totalB={poll.totalB}
        winner={poll.winner as "A" | "B"}
        voteCount={poll.voteCount}
        locked={!session?.user}
        lockOverlay={
          <>
            <p className="kicker">Access required</p>
            <p className="text-lg font-semibold uppercase tracking-[0.08em] text-[color:var(--text)]">
              Log in or sign up to continue
            </p>
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              Closed poll results stay locked until you have an account. Shareable result cards
              will be handled separately later.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href={`/login?callbackUrl=/result/${poll.id}`} className="primary-cta">
                Log in
              </Link>
              <Link href={`/signup?callbackUrl=/result/${poll.id}`} className="ghost-cta">
                Sign up
              </Link>
            </div>
          </>
        }
      />

      {viewerVote && progression ? (
        <ResultFeedbackCard
          aPoints={viewerVote.aPoints}
          bPoints={viewerVote.bPoints}
          currentProgression={progression}
          winner={poll.winner as "A" | "B"}
        />
      ) : null}
    </main>
  );
}
