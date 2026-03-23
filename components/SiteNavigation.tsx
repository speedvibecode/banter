"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  PlusSquare,
  Search,
  ShieldAlert,
  TimerReset,
  UserCircle2
} from "lucide-react";

import { ProgressionPanel } from "@/components/ProgressionPanel";
import type { ProgressionSummary } from "@/lib/progression";

type SiteNavigationProps = {
  isAdmin: boolean;
  progression?: ProgressionSummary | null;
  username?: string | null;
};

type NavLink = {
  disabled?: boolean;
  href: string;
  label: string;
  icon: typeof Home;
  match?: string;
};

const baseLinks: NavLink[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/create", label: "Create Poll", icon: PlusSquare }
];

export function SiteNavigation({ isAdmin, progression, username }: SiteNavigationProps) {
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
  const mobileLinks = [
    { href: "/", label: "Home", icon: Home, match: "/" },
    { href: "/create", label: "Create", icon: PlusSquare },
    ...(isAdmin ? [{ href: "/admin/moderation", label: "Review", icon: TimerReset }] : []),
    { href: "/search", label: "Search", icon: Search, match: "/search" },
    {
      href: username ? `/profile/${encodeURIComponent(username)}` : "/login",
      label: "Profile",
      icon: UserCircle2,
      match: "/profile"
    }
  ];

  return (
    <>
      <aside className="hidden sticky top-0 h-full min-h-0 w-full max-w-[248px] self-start overflow-hidden border border-subtle bg-[color:var(--surface-raise)] p-4 backdrop-blur-xl lg:flex lg:flex-col lg:justify-between">
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
                    : "text-[color:var(--muted)] hover:bg-[color:var(--ghost-bg)] hover:text-[color:var(--text)]"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-4">
          {progression ? <ProgressionPanel progression={progression} compact /> : null}
          <Link href="/create" className="primary-cta w-full">
            Create Poll
          </Link>
        </div>
      </aside>

      <nav
        className={`shell-panel fixed inset-x-0 bottom-0 z-50 grid gap-1 rounded-none border-x-0 border-b-0 px-2 pb-[calc(env(safe-area-inset-bottom)+0.7rem)] pt-2 lg:hidden ${
          mobileLinks.length === 5 ? "grid-cols-5" : "grid-cols-4"
        }`}
      >
        {mobileLinks.map((link) => {
            const isActive =
              (pathname === link.href ||
                (link.match && pathname.startsWith(link.match) && link.match !== "/"));
            const Icon = link.icon;

            const className = `flex flex-col items-center gap-1 px-2 py-2 text-[0.56rem] font-semibold uppercase tracking-[0.2em] ${
              isActive ? "text-[color:var(--primary)]" : "text-[color:var(--muted)]"
            }`;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={className}
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
