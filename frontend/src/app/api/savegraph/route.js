import { db } from "@/libs/db/drizzle"
import { graphs } from "@/libs/db/schema"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const body = await request.json()
    const { graph, id, raw_text } = body

    console.log("Request body:", body)

    if (!id || !graph) {
      return NextResponse.json(
        {
          message: "Invalid request",
        },
        {
          status: 400,
        }
      )
    }

    await db.insert(graphs).values({
      graph: JSON.stringify(graph),
      userId: id,
      raw_text,
      name: "Your Void Graph",
    })

    return NextResponse.json(
      {
        message: "Graph saved successfully",
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to save graph",
      },
      {
        status: 500,
      }
    )
  }
}
