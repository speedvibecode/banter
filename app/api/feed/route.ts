import { NextResponse } from "next/server";

import { listActivePolls, listRecentPolls } from "@/services/pollService";

export async function GET() {
  const [activePolls, recentPolls] = await Promise.all([
    listActivePolls(),
    listRecentPolls()
  ]);

  return NextResponse.json({
    activePolls,
    recentPolls
  });
}
