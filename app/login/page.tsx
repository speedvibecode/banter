import { redirect } from "next/navigation";

import { LoginForm } from "@/components/LoginForm";
import { auth } from "@/lib/auth";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="mx-auto max-w-xl space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-blue-400">Login</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
          Enter the arena.
        </h1>
      </div>
      <LoginForm />
    </main>
  );
}
