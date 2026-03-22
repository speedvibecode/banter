"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { LogoutButton } from "@/components/LogoutButton";

type AuthButtonsProps = {
  isAuthenticated: boolean;
  username?: string | null;
};

export function AuthButtons({ isAuthenticated, username }: AuthButtonsProps) {

  if (!isAuthenticated) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/login" className="ghost-cta px-4 py-2.5 text-xs">
          Login
        </Link>
        <Link href="/signup" className="secondary-cta px-4 py-2.5 text-xs">
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {username ? (
        <Link
          href={`/profile/${encodeURIComponent(username)}`}
          className="group flex items-center gap-3 bg-[color:var(--ghost-bg)] px-3 py-2 text-sm text-[color:var(--text)] transition hover:bg-[color:var(--ghost-hover)]"
        >
          <span className="flex h-9 w-9 items-center justify-center bg-[color:var(--primary)]/10 text-xs font-bold uppercase text-[color:var(--primary)]">
            {username.slice(0, 2)}
          </span>
          <span className="space-y-0.5">
            <span className="block text-[0.62rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">
              Active account
            </span>
            <span className="flex items-center gap-2 font-semibold uppercase tracking-[0.12em]">
              {username}
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </span>
          </span>
        </Link>
      ) : null}

      <LogoutButton className="ghost-cta px-4 py-2.5 text-xs" />
    </div>
  );
}
