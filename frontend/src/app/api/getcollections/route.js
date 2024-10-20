import { NextResponse } from "next/server"
import { db } from "@/libs/db/drizzle"
import { graphs } from "@/libs/db/schema"

export async function GET() {
  try {
    const collections = await db.select().from(graphs)

    return NextResponse.json(
      {
        collections,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "Surrogate-Control": "no-store",
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error fetching collections",
      },
      { status: 500 }
    )
  }
}
