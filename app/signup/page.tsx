import { redirect } from "next/navigation";

import { SignupForm } from "@/components/SignupForm";
import { auth } from "@/lib/auth";

export default async function SignupPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="mx-auto max-w-xl space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-blue-400">Sign up</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
          Create your Banter account.
        </h1>
      </div>
      <SignupForm />
    </main>
  );
}
