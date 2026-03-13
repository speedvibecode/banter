import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getClientKey, rateLimit } from "@/lib/rateLimit";
import { voteSchema } from "@/lib/schemas";
import { submitVote } from "@/services/voteService";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const limit = rateLimit(getClientKey(request, "vote"), 30, 60 * 1000);

    if (!limit.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
    }

    const body = await request.json();
    const input = voteSchema.parse({
      ...body,
      aPoints: Number(body.aPoints),
      bPoints: Number(body.bPoints)
    });
    const vote = await submitVote({
      ...input,
      userId: session.user.id
    });

    return NextResponse.json({ voteId: vote.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request." },
      { status: 400 }
    );
  }
}
