"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

type AuthButtonsProps = {
  isAuthenticated: boolean;
  username?: string | null;
};

export function AuthButtons({ isAuthenticated, username }: AuthButtonsProps) {
  if (!isAuthenticated) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/login"
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-500"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-zinc-400">{username}</span>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-500"
      >
        Logout
      </button>
    </div>
  );
}
