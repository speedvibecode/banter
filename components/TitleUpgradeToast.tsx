"use client";

import { useEffect, useState } from "react";

import { TITLE_LEVELS, type TitleName, getTitleIndex } from "@/lib/progression";

const STORAGE_KEY = "banter-seen-title";

type TitleUpgradeToastProps = {
  currentTitle: TitleName;
};

export function TitleUpgradeToast({ currentTitle }: TitleUpgradeToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const previousTitle = window.localStorage.getItem(STORAGE_KEY) as TitleName | null;
    const isKnownTitle = previousTitle
      ? TITLE_LEVELS.some((level) => level.title === previousTitle)
      : false;

    if (isKnownTitle && getTitleIndex(currentTitle) > getTitleIndex(previousTitle as TitleName)) {
      setVisible(true);
    }

    window.localStorage.setItem(STORAGE_KEY, currentTitle);
  }, [currentTitle]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed right-4 top-24 z-[70] max-w-sm shell-panel px-5 py-4">
      <p className="kicker">Title upgraded!</p>
      <p className="mt-2 text-lg font-semibold uppercase tracking-[0.08em] text-[color:var(--text)]">
        You are now {currentTitle}
      </p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--primary)]"
      >
        Dismiss
      </button>
    </div>
  );
}
