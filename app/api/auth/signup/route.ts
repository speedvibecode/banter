import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { identitySchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";

const signupSchema = identitySchema.extend({
  password: z.string().min(8).max(100)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = signupSchema.parse(body);
    const email = input.email.trim().toLowerCase();
    const username = input.username.trim();

    const existingByEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingByEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const existingByUsername = await prisma.user.findUnique({
      where: { username }
    });

    if (existingByUsername) {
      return NextResponse.json(
        { error: "That username is already taken." },
        { status: 409 }
      );
    }

    const passwordHash = await hash(input.password, 12);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash
      }
    });

    return NextResponse.json({ userId: user.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request." },
      { status: 400 }
    );
  }
}
