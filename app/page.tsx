import { AuthLanding } from "@/components/AuthLanding";
import { HomeFeed } from "@/components/HomeFeed";
import { auth } from "@/lib/auth";
import { listActivePolls, listRecentPolls } from "@/services/pollService";

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

  return (
    <main>
      <HomeFeed activePolls={activePolls} recentPolls={recentPolls} />
    </main>
  );
}
