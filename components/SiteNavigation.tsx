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
  { href: "/create", label: "Create Post", icon: PlusSquare }
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
  const mobileLinks = [
    { href: "/", label: "Home", icon: Home, match: "/" },
    { href: "/create", label: "Create", icon: PlusSquare },
    ...(isAdmin ? [{ href: "/admin/moderation", label: "Review", icon: TimerReset }] : []),
    {
      href: username ? `/profile/${encodeURIComponent(username)}` : "/login",
      label: "Profile",
      icon: UserCircle2,
      match: "/profile"
    }
  ];

  return (
    <>
      <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] w-full max-w-[248px] self-start overflow-y-auto border border-white/6 bg-[rgba(14,16,18,0.88)] p-4 backdrop-blur-xl lg:flex lg:flex-col lg:justify-between">
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

        <div className="section-panel space-y-4 p-4">
          <div className="kicker">Community Snapshot</div>
          <div className="space-y-3 text-sm text-[color:var(--muted)]">
            <div className="flex items-center justify-between">
              <span>Open polls</span>
              <span className="text-[color:var(--primary)]">Live</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Fresh posts</span>
              <span className="text-white">Rolling</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Recent results</span>
              <span className="text-[color:var(--secondary)]">Updated</span>
            </div>
          </div>
          <Link href="/create" className="primary-cta w-full">
            Create Post
          </Link>
        </div>
      </aside>

      <nav
        className={`shell-panel fixed inset-x-4 bottom-4 z-50 grid gap-2 p-2 lg:hidden ${
          mobileLinks.length === 4 ? "grid-cols-4" : "grid-cols-3"
        }`}
      >
        {mobileLinks.map((link) => {
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
