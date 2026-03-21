"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  PlusSquare,
  ShieldAlert,
  TimerReset,
  UserCircle2
} from "lucide-react";

type SiteNavigationProps = {
  isAdmin: boolean;
  username?: string | null;
};

type NavLink = {
  href: string;
  label: string;
  icon: typeof Home;
  match?: string;
};

const baseLinks: NavLink[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/create", label: "New Judgment", icon: PlusSquare }
];

export function SiteNavigation({ isAdmin, username }: SiteNavigationProps) {
  const pathname = usePathname();
  const links = [
    ...baseLinks,
    {
      href: username ? `/profile/${encodeURIComponent(username)}` : "/login",
      label: "Profile",
      icon: UserCircle2,
      match: "/profile"
    },
    ...(isAdmin
      ? [{ href: "/admin/moderation", label: "Moderation", icon: ShieldAlert }]
      : [])
  ];

  return (
    <>
      <aside className="shell-panel hidden min-h-[calc(100vh-8rem)] w-full max-w-[248px] flex-col justify-between p-4 lg:flex">
        <nav className="space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.match ?? `${link.href}/`);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-[0.26em] transition ${
                  isActive
                    ? "bg-[color:var(--surface-high)] text-[color:var(--primary)] neon-shadow-green"
                    : "text-[color:var(--muted)] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="section-panel grid-panel space-y-4 p-4">
          <div className="kicker">Signal Check</div>
          <div className="space-y-3 text-sm text-[color:var(--muted)]">
            <div className="flex items-center justify-between">
              <span>Live Arena</span>
              <span className="text-[color:var(--primary)]">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Market Pulse</span>
              <span className="text-white">Realtime</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Reputation Loop</span>
              <span className="text-[color:var(--secondary)]">Synced</span>
            </div>
          </div>
          <Link href="/create" className="primary-cta w-full">
            Launch Argument
          </Link>
        </div>
      </aside>

      <nav className="shell-panel fixed inset-x-4 bottom-4 z-50 grid grid-cols-4 gap-2 p-2 lg:hidden">
        {[
          { href: "/", label: "Home", icon: Home, match: "/" },
          { href: "/create", label: "Create", icon: PlusSquare },
          { href: "/admin/moderation", label: "Review", icon: TimerReset, hidden: !isAdmin },
          {
            href: username ? `/profile/${encodeURIComponent(username)}` : "/login",
            label: "Profile",
            icon: UserCircle2,
            match: "/profile"
          }
        ]
          .filter((link) => !link.hidden)
          .map((link) => {
            const isActive =
              pathname === link.href ||
              (link.match && pathname.startsWith(link.match) && link.match !== "/");
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.24em] ${
                  isActive ? "text-[color:var(--primary)]" : "text-[color:var(--muted)]"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
      </nav>
    </>
  );
}
