import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getClientKey, rateLimit } from "@/lib/rateLimit";
import { createPollSchema } from "@/lib/schemas";
import { createPoll } from "@/services/pollService";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const limit = rateLimit(getClientKey(request, "poll-create"), 5, 60 * 60 * 1000);

    if (!limit.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
    }

    const body = await request.json();
    const input = createPollSchema.parse({
      ...body,
      durationMinutes: Number(body.durationMinutes)
    });
    const poll = await createPoll({
      ...input,
      creatorId: session.user.id
    });

    return NextResponse.json({ pollId: poll.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request." },
      { status: 400 }
    );
  }
}
