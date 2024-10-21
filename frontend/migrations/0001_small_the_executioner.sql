ALTER TABLE "formatted_texts" ADD COLUMN "embedding" vector(768);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "formatted_texts" USING hnsw ("embedding" vector_cosine_ops);