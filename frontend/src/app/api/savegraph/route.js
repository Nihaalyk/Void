import { db } from "@/libs/db/drizzle"
import { graphs } from "@/libs/db/schema"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, graph } = body

    const graphData = await db
      .insert(graphs)
      .values({
        graph,
        user: userId,
      })
      .returning()

    return NextResponse.json({
      message: "Graph saved successfully",
      data: graphData,
    })
  } catch (error) {
    return NextResponse.json({
      message: "Failed to save graph",
    })
  }
}
