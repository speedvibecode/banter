import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Inter, Space_Grotesk } from "next/font/google";
import { Search, ShieldCheck } from "lucide-react";

import "@/app/globals.css";
import logoImage from "@/logo.jpeg";
import logoLightImage from "@/logo_light.png";
import logoMidnightImage from "@/logo_midnight.png";
import { AuthButtons } from "@/components/AuthButtons";
import { MobilePageTransition } from "@/components/MobilePageTransition";
import { SiteNavigation } from "@/components/SiteNavigation";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { TitleUpgradeToast } from "@/components/TitleUpgradeToast";
import { auth, isAdminEmail } from "@/lib/auth";
import { getUserProgression } from "@/services/progressionService";

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
  const progression = session?.user?.id ? await getUserProgression(session.user.id) : null;

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body className="overflow-hidden font-[var(--font-inter)] antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("banter-theme");var d=window.matchMedia("(prefers-color-scheme: dark)").matches?"graphite":"light";document.documentElement.dataset.theme=t||d;}catch(e){document.documentElement.dataset.theme="light";}`
          }}
        />
        <div className="mx-auto flex h-dvh max-w-[1540px] flex-col overflow-hidden px-3 pt-3 sm:px-6 lg:px-8 lg:pt-6">
          <header className="shell-panel z-40 mb-3 shrink-0 flex flex-col gap-3 px-3 py-3 sm:mb-5 sm:gap-4 sm:px-6 sm:py-4 lg:sticky lg:top-0 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden bg-[color:var(--primary)]/10 neon-shadow-green sm:h-11 sm:w-11">
                  <Image
                    src={logoImage}
                    alt="Banter logo"
                    className="theme-logo theme-logo-graphite h-full w-full object-cover"
                    priority
                  />
                  <Image
                    src={logoLightImage}
                    alt="Banter logo"
                    className="theme-logo theme-logo-light h-full w-full object-cover"
                    priority
                  />
                  <Image
                    src={logoMidnightImage}
                    alt="Banter logo"
                    className="theme-logo theme-logo-navy h-full w-full object-cover"
                    priority
                  />
                </div>
                <div>
                  <p className="font-[var(--font-space)] text-[1.35rem] font-bold uppercase tracking-[0.14em] text-[color:var(--primary)] sm:text-2xl sm:tracking-[0.18em]">
                    Banter
                  </p>
                  <p className="text-[0.5rem] uppercase tracking-[0.22em] text-[color:var(--muted)] sm:text-xs sm:tracking-[0.34em]">
                    Discuss it. Pick a side.
                  </p>
                </div>
              </Link>

              <div className="lg:hidden">
                <ThemeSwitcher compactOnMobile />
              </div>

              {isAdmin ? (
                <div className="neon-chip status-purple hidden sm:inline-flex">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Moderation Enabled
                </div>
              ) : null}
            </div>

            <div className="flex flex-1 flex-col gap-3 lg:max-w-3xl lg:flex-row lg:items-center lg:justify-end">
              {session?.user ? (
                <>
                  <div className="hidden lg:block">
                    <ThemeSwitcher compactOnMobile />
                  </div>
                  <form
                    action="/search"
                    className="grid-panel hidden items-center gap-3 px-4 py-3 text-sm text-[color:var(--muted)] lg:flex lg:min-w-[320px] lg:max-w-[420px] lg:flex-1"
                  >
                    <Search className="h-4 w-4" />
                    <input
                      type="search"
                      name="q"
                      placeholder="Search polls and profiles"
                      className="w-full bg-transparent text-sm uppercase tracking-[0.16em] text-[color:var(--text)] outline-none placeholder:text-[color:var(--muted)]"
                      aria-label="Search polls and profiles"
                    />
                  </form>
                </>
              ) : null}

              {session?.user ? (
                <div className="hidden lg:block">
                  <AuthButtons isAuthenticated username={session.user.name} />
                </div>
              ) : null}
            </div>
          </header>

          <div className="min-h-0 flex-1 pb-20 lg:pb-8">
            {session?.user ? (
              <div className="grid h-full gap-5 lg:grid-cols-[248px_minmax(0,1fr)]">
                <SiteNavigation isAdmin={isAdmin} progression={progression} username={session.user.name} />
                <div className="viewport-scroll-right min-h-0 overflow-y-auto">
                  <MobilePageTransition>{children}</MobilePageTransition>
                </div>
              </div>
            ) : (
              <div className="viewport-scroll-right h-full overflow-y-auto">
                <MobilePageTransition>{children}</MobilePageTransition>
              </div>
            )}
          </div>
        </div>
        {progression ? <TitleUpgradeToast currentTitle={progression.title} /> : null}
      </body>
    </html>
  );
}
