ALTER TABLE "chunks" ADD COLUMN "embedding" vector(768);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "chunks" USING hnsw ("embedding" vector_cosine_ops);