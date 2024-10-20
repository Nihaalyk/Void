import { NextResponse } from "next/server"
import { db } from "@/libs/db/drizzle"
import { eq } from "drizzle-orm"
import { users } from "@/libs/db/schema"
import bcrypt from "bcryptjs"
import { generateVerificationToken } from "@/libs/misc/token"
import { verifyMail } from "@/utils/verifyEmail"

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, password } = body
    
    console.log(body)

    const userExists = await db.query.users.findFirst({
      where: eq(users.email, email),
    })


    if (userExists) {
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
    })

    // INSERT TOKEN
    const { verificationToken, verificationTokenExpiredAt } =
      generateVerificationToken()
    await db.insert(tokens).values({
      token: verificationToken,
      expiresAt: verificationTokenExpiredAt,
      type: "EMAIL_VERIFICATION",
      userId: user.id,
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
