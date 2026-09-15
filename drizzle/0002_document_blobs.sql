CREATE TABLE IF NOT EXISTS "document_blobs" (
	"key" text PRIMARY KEY NOT NULL,
	"bytes" bytea NOT NULL,
	"content_type" text DEFAULT 'application/octet-stream' NOT NULL,
	"size" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
