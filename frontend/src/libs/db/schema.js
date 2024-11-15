import {
  uuid,
  integer,
  index,
  serial,
  vector,
  varchar,
  text,
  timestamp,
  boolean,
  pgTable,
  pgEnum,
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
  name: varchar(20).notNull().default("Your Void Graph"),
  raw_text: text("raw_text").notNull(),
  graph: text("graph").notNull(),
  extra: text("extra"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(),
  userId: uuid("user_id").references(() => users.id),
})

export const formattedTexts = pgTable("formatted_texts", {
  id: uuid("id").primaryKey().defaultRandom(),
  text: text().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const roleEnum = pgEnum("role_enum", ["user", "assistant"])

export const chatHistory = pgTable("chat_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  role: roleEnum("role").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").default(null),
  createdAt: timestamp("created_at").defaultNow(),
})

export const documentsTable = pgTable("documents", {
  id: serial().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  source: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
})

/* export const chunksTable = pgTable(
  'chunks',
  {
    id: serial().primaryKey(),
    documentId: integer('document_id')
      .references(() => documentsTable.id)
      .notNull(),
    chunkIndex: integer("chunk_index").notNull(),
    content: text().notNull(),
    embedding: vector('embedding', {
      dimensions: parseInt(process.env.EMBEDDING_DIMENSION)
    }),
  },
  (table) => ({
    embeddingIndex: index('embeddingIndex')
      .using('hnsw', table.embedding.op('vector_cosine_ops')),
  }),
);
 */
