import { NextResponse } from "next/server"
import { db } from "@/libs/db/drizzle"
import { eq } from "drizzle-orm"
import { users, tokens } from "@/libs/db/schema"
import bcrypt from "bcryptjs"
import { generateVerificationToken } from "@/libs/misc/token"
import { verifyMail } from "@/utils/verifyEmail"
import { sendMail } from "@/libs/misc/sendMail"

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.email, email))

    if (userExists.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // INSERT USER
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    }).returning()

    console.log("user:", user[0].id)

    // INSERT TOKEN
    const { verificationToken, verificationTokenExpiredAt } =
      generateVerificationToken()
    await db.insert(tokens).values({
      token: verificationToken,
      expiresAt: verificationTokenExpiredAt,
      type: "EMAIL_VERIFICATION",
      userId: user[0].id,
    })

    const verifyEmailUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`
    const message = verifyMail(verifyEmailUrl)

    await sendMail(email, message)

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
