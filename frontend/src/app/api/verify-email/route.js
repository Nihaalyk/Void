import { NextResponse } from "next/server"
import { db } from "@/libs/db/drizzle"
import { eq } from "drizzle-orm"
import { tokens } from "@/libs/db/schema"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 })
  }

  const tokenData = await db.query.tokens.findFirst({
    where: eq(tokens.token, token),
  })

  if (!tokenData || tokenData.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    )
  }

  await db
    .update(users)
    .set({
      emailVerified: true,
    })
    .where(eq(users.id, tokenData.userId))

  await db.delete(tokens).where(eq(tokens.id, tokenData.id))

  return NextResponse.redirect(new URL("/login", request.url))
}
