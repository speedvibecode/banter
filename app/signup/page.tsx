import { redirect } from "next/navigation";

import { AuthLanding } from "@/components/AuthLanding";
import { auth } from "@/lib/auth";
import { listActivePolls, listRecentPolls } from "@/services/pollService";

export default async function SignupPage() {
  const [session, activePolls, recentPolls] = await Promise.all([
    auth(),
    listActivePolls(),
    listRecentPolls()
  ]);

  if (session?.user) {
    redirect("/");
  }

  return (
    <AuthLanding activePolls={activePolls} initialMode="signup" recentPolls={recentPolls} />
  );
}
