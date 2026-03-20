import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquareText, Plus } from "lucide-react";

import "@/app/globals.css";
import { AuthButtons } from "@/components/AuthButtons";
import { auth, isAdminEmail } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Banter",
  description: "Where arguments end."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const isAdmin = isAdminEmail(session?.user?.email);

  return (
    <html lang="en">
      <body className="text-zinc-50 antialiased">
        <div className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6">
          <header className="mb-8 flex flex-col gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/80 px-4 py-3 backdrop-blur md:flex-row md:items-center md:justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/15 p-2 text-blue-400">
                <MessageSquareText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight">Banter</p>
                <p className="text-sm text-zinc-400">Where arguments end.</p>
              </div>
            </Link>
            <nav className="flex w-full flex-wrap items-center gap-2 md:w-auto md:justify-end">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                <Plus className="h-4 w-4" />
                Create Poll
              </Link>
              {/* Keep moderation discoverable only for admins and enforce the same rule server-side elsewhere. */}
              {isAdmin ? (
                <Link
                  href="/admin/moderation"
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-500"
                >
                  Moderation
                </Link>
              ) : null}
              <AuthButtons
                isAuthenticated={Boolean(session?.user)}
                userId={session?.user?.id}
                username={session?.user?.name}
              />
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
