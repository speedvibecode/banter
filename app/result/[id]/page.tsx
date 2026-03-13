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
    <main className="mx-auto max-w-3xl space-y-6">
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
