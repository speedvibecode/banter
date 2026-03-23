import { AuthLanding } from "@/components/AuthLanding";
import { HomeFeed } from "@/components/HomeFeed";
import { auth } from "@/lib/auth";
import { listActivePolls, listRecentPolls } from "@/services/pollService";
import { getUserProgression } from "@/services/progressionService";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [session, activePolls, recentPolls] = await Promise.all([
    auth(),
    listActivePolls(),
    listRecentPolls()
  ]);

  if (!session?.user) {
    return <AuthLanding activePolls={activePolls} recentPolls={recentPolls} />;
  }

  const progression = await getUserProgression(session.user.id);

  return (
    <main>
      {progression ? (
        <HomeFeed activePolls={activePolls} recentPolls={recentPolls} progression={progression} />
      ) : (
        <HomeFeed
          activePolls={activePolls}
          recentPolls={recentPolls}
          progression={{
            badges: [],
            currentStreak: 0,
            nextTitle: "Learner",
            nextTitleMinReputation: 50,
            progress: 0,
            reputation: 0,
            title: "Rookie",
            titleMinReputation: 0,
            totalVotes: 0
          }}
        />
      )}
    </main>
  );
}
