import { notFound } from "next/navigation";

import { ResultCard } from "@/components/ResultCard";
import { getPoll, resolvePoll } from "@/services/pollService";

export const dynamic = "force-dynamic";

type ResultPageProps = {
  params: {
    id: string;
  };
};

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = params;
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

  return (
    <main className="space-y-6">
      <section className="shell-panel grid gap-5 px-6 py-8 sm:px-8">
        <p className="kicker">Resolved signal</p>
        <h1 className="font-[var(--font-space)] text-5xl font-bold uppercase leading-[0.94] tracking-[-0.06em] text-white sm:text-6xl">
          Final verdict
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
      />
    </main>
  );
}
