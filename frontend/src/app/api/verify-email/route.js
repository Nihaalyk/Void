import { NextResponse } from "next/server"
import { db } from "@/libs/db/drizzle"
import { eq } from "drizzle-orm"
import { tokens, users } from "@/libs/db/schema"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 })
  }

  console.log("token:", token)

  const tokenData = await db
    .select()
    .from(tokens)
    .where(eq(tokens.token, token))

  console.log("tokenData:", tokenData)

  if (tokenData.length === 0 || tokenData[0].expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    )
  }

  console.log("tokenData[0].userId:", tokenData[0].userId)

  await db
    .update(users)
    .set({
      emailVerified: true,
    })
    .where(eq(users.id, tokenData[0].userId))

  await db.delete(tokens).where(eq(tokens.id, tokenData[0].id))

  return NextResponse.json({ message: "Email verified" }, { status: 200 })
}
