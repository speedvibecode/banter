import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getClientKey, rateLimit } from "@/lib/rateLimit";
import { reportSchema } from "@/lib/schemas";
import { createReport } from "@/services/reportService";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const limit = rateLimit(getClientKey(request, "report"), 10, 60 * 60 * 1000);

    if (!limit.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
    }

    const body = await request.json();
    const input = reportSchema.parse(body);
    const report = await createReport({
      ...input,
      reporterId: session.user.id
    });

    return NextResponse.json({ reportId: report.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request." },
      { status: 400 }
    );
  }
}
