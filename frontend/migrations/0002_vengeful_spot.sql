CREATE TYPE "public"."role_enum" AS ENUM('user', 'assistant');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chat_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "role_enum" NOT NULL,
	"content" text NOT NULL,
	"image_url" text DEFAULT null,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_history" ADD CONSTRAINT "chat_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
