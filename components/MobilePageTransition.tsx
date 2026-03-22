"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

type MobilePageTransitionProps = {
  children: ReactNode;
};

export function MobilePageTransition({ children }: MobilePageTransitionProps) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="mobile-page-transition">
      {children}
    </div>
  );
}
