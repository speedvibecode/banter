import { NextResponse } from "next/server";

import { getPoll } from "@/services/pollService";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = context.params;
  const poll = await getPoll(id);

  if (!poll) {
    return NextResponse.json({ error: "Poll not found." }, { status: 404 });
  }

  return NextResponse.json(poll);
}
