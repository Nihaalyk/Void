import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/libs/db/drizzle"
import { eq } from "drizzle-orm"
import { users } from "@/libs/db/schema"

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  try {
    const session = await getSession()
    if (!session?.user?.email) {
      return null
    }

    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))

    if (currentUser.length === 0) {
      return null
    }

    return {
      ...currentUser[0],
      createdAt: currentUser[0].createdAt.toISOString(),
      updatedAt: currentUser[0].updatedAt.toISOString(),
    }
  } catch (error) {
    return null
  }
}
