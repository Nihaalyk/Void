import { db } from "@/libs/db/drizzle"
import { graphs } from "@/libs/db/schema"
import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"

export async function DELETE(request) {
  try {
    const { id } = await request.json()

    await db.delete(graphs).where(eq(graphs.id, id))

    return NextResponse.json({
      message: "Graph deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({
      message: "Error deleting graph",
    })
  }
}
