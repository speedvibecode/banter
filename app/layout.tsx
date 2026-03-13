import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquareText, Plus } from "lucide-react";

import "@/app/globals.css";
import { AuthButtons } from "@/components/AuthButtons";
import { auth } from "@/lib/auth";

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

  return (
    <html lang="en">
      <body className="text-zinc-50 antialiased">
        <div className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6">
          <header className="mb-8 flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-950/80 px-4 py-3 backdrop-blur">
            <Link href="/" className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/15 p-2 text-blue-400">
                <MessageSquareText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight">Banter</p>
                <p className="text-sm text-zinc-400">Where arguments end.</p>
              </div>
            </Link>
            <nav className="flex items-center gap-2">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                <Plus className="h-4 w-4" />
                Create Poll
              </Link>
              <Link
                href="/admin/moderation"
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-500"
              >
                Moderation
              </Link>
              <AuthButtons
                isAuthenticated={Boolean(session?.user)}
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
