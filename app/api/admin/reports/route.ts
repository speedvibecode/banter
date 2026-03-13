import { NextResponse } from "next/server";

import { auth, isAdminEmail } from "@/lib/auth";
import { moderationActionSchema } from "@/lib/schemas";
import { resolveReport, reviewReport } from "@/services/reportService";

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const body = await request.json();
    const input = moderationActionSchema.parse(body);

    if (input.action === "ignore") {
      await reviewReport(input.reportId);
    } else {
      await resolveReport(input.reportId, true);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request." },
      { status: 400 }
    );
  }
}
