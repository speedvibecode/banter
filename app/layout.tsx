import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Space_Grotesk } from "next/font/google";
import { Bolt, Search, ShieldCheck } from "lucide-react";

import "@/app/globals.css";
import { AuthButtons } from "@/components/AuthButtons";
import { SiteNavigation } from "@/components/SiteNavigation";
import { auth, isAdminEmail } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space"
});

export const metadata: Metadata = {
  title: "Banter",
  description: "A place to post questions, pick a side, and see where people land."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const isAdmin = isAdminEmail(session?.user?.email);

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-[var(--font-inter)] text-zinc-50 antialiased">
        <div className="mx-auto min-h-screen max-w-[1540px] px-4 pb-28 pt-4 sm:px-6 lg:px-8 lg:pb-10 lg:pt-6">
          <header className="shell-panel sticky top-4 z-40 mb-6 flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center bg-[color:var(--primary)]/10 text-[color:var(--primary)] neon-shadow-green">
                  <Bolt className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-[var(--font-space)] text-2xl font-bold uppercase tracking-[0.18em] text-[color:var(--primary)]">
                    Banter
                  </p>
                  <p className="text-xs uppercase tracking-[0.34em] text-[color:var(--muted)]">
                    Discuss it. Pick a side.
                  </p>
                </div>
              </Link>

              {isAdmin ? (
                <div className="neon-chip status-purple hidden sm:inline-flex">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Moderation Enabled
                </div>
              ) : null}
            </div>

            <div className="flex flex-1 flex-col gap-4 lg:max-w-3xl lg:flex-row lg:items-center lg:justify-end">
              <div className="grid-panel flex items-center gap-3 px-4 py-3 text-sm text-[color:var(--muted)] lg:min-w-[320px] lg:max-w-[420px] lg:flex-1">
                <Search className="h-4 w-4" />
                <span className="truncate uppercase tracking-[0.16em]">
                  Fresh posts, active polls, and recent results.
                </span>
              </div>

              <AuthButtons
                isAuthenticated={Boolean(session?.user)}
                username={session?.user?.name}
              />
            </div>
          </header>

          <div className="grid gap-5 lg:grid-cols-[248px_minmax(0,1fr)] lg:items-start">
            <SiteNavigation isAdmin={isAdmin} username={session?.user?.name} />
            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
