import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { deletePollByCreator } from "@/services/pollService";

type PollRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, { params }: PollRouteProps) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { id } = await params;

    await deletePollByCreator(id, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request.";
    const status = message === "Poll not found." ? 404 : 400;

    return NextResponse.json({ error: message }, { status });
  }
}
