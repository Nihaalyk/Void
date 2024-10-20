import { db } from "@/libs/db/drizzle"
import { graphs } from "@/libs/db/schema"
import { NextResponse } from "next/server"

export async function POST(request) {
  const body = await request.json()

  const { userId, raw_text, graph, extra } = body

  const graphData = await db.insert(graphs).values({
    raw_text,
    graph,
    extra,
    userId,
  })

  return NextResponse.json({
    message: "Graph saved successfully",
  })
}
