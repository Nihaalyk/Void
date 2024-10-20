import {
  uuid,
  jsonb,
  text,
  timestamp,
  boolean,
  pgTable,
} from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(),
})

export const tokens = pgTable("tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  token: text("token").notNull().unique(),
  type: text("type"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdateFn(),
  userId: uuid("user_id").references(() => users.id),
})

export const graphs = pgTable("graphs", {
  id: uuid("id").primaryKey().defaultRandom(),
  raw_text: text("raw_text").notNull(),
  graph: jsonb("graph").notNull(),
  extra: text("extra"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(),
  userId: uuid("user_id").references(() => users.id),
})

