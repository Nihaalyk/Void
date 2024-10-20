import { db } from "@/libs/db/drizzle"
import { graphs } from "@/libs/db/schema"
import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"

export async function POST(request) {
  const body = await request.json()
  const { id } = body

  const graphData = await db.delete(graphs).where(eq(graphs.id, id))

  return NextResponse.json({
    message: "Graph deleted successfully",
  })
}
