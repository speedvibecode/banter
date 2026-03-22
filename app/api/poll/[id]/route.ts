import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getPoll } from "@/services/pollService";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const session = await auth();
  const poll = await getPoll(id);

  if (!poll) {
    return NextResponse.json({ error: "Poll not found." }, { status: 404 });
  }

  if (poll.status === "CLOSED" && !session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  return NextResponse.json(poll);
}
