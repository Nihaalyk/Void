import { config } from "dotenv"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

config({ path: ".env" })

const sql = neon(
  "postgresql://void_owner:8tWKVyvoJ2fH@ep-red-voice-a1szdot5.ap-southeast-1.aws.neon.tech/void?sslmode=require"
)

export const db = drizzle(sql)
