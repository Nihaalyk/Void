import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/libs/db/drizzle"
import { eq } from "drizzle-orm"
import { users } from "@/libs/db/schema"
import bcrypt from "bcryptjs"

export const authOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email),
        })

        if (!user || !user?.password) {
          throw new Error("Invalid Email or Password")
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email first")
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!passwordMatch) {
          throw new Error("Invalid Email or Password")
        }

        return user
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    signUp: "/sign-up",
    verifyRequest: "/verify-request",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
