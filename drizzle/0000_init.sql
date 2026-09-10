CREATE TABLE "agent_runs" (
	"id" text PRIMARY KEY NOT NULL,
	"agent_id" text NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"finished_at" timestamp with time zone NOT NULL,
	"actor" text NOT NULL,
	"status" text NOT NULL,
	"finding_count" integer DEFAULT 0 NOT NULL,
	"summary" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_events" (
	"id" text PRIMARY KEY NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL,
	"actor" text NOT NULL,
	"action" text NOT NULL,
	"target_type" text,
	"target_id" text,
	"outcome" text NOT NULL,
	"detail" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "governed_records" (
	"type" text NOT NULL,
	"id" text NOT NULL,
	"tenant_id" text DEFAULT 'cloudpoint' NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"owning_team" text DEFAULT '' NOT NULL,
	"classification" text DEFAULT 'internal' NOT NULL,
	"status" text DEFAULT '' NOT NULL,
	"search_text" text DEFAULT '' NOT NULL,
	"data" jsonb NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"updated_by" text DEFAULT 'seed' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "governed_records_type_id_pk" PRIMARY KEY("type","id")
);
--> statement-breakpoint
CREATE TABLE "imported_content" (
	"id" text PRIMARY KEY NOT NULL,
	"source_path" text NOT NULL,
	"data" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "relationships" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "relationships_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"from_type" text NOT NULL,
	"from_id" text NOT NULL,
	"to_type" text NOT NULL,
	"to_id" text NOT NULL,
	"type" text NOT NULL,
	"confidence" text DEFAULT 'declared' NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "source_files" (
	"id" text PRIMARY KEY NOT NULL,
	"path" text NOT NULL,
	"media_type" text NOT NULL,
	"label" text DEFAULT '' NOT NULL,
	"storage" text DEFAULT 'local' NOT NULL,
	"storage_key" text NOT NULL,
	"bytes" integer DEFAULT 0 NOT NULL,
	"uploaded_by" text DEFAULT '' NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "audit_events_at_idx" ON "audit_events" USING btree ("at");--> statement-breakpoint
CREATE INDEX "audit_events_actor_idx" ON "audit_events" USING btree ("actor");--> statement-breakpoint
CREATE INDEX "governed_records_type_idx" ON "governed_records" USING btree ("type");--> statement-breakpoint
CREATE INDEX "governed_records_team_idx" ON "governed_records" USING btree ("owning_team");--> statement-breakpoint
CREATE INDEX "governed_records_updated_idx" ON "governed_records" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "relationships_from_idx" ON "relationships" USING btree ("from_type","from_id");--> statement-breakpoint
CREATE INDEX "relationships_to_idx" ON "relationships" USING btree ("to_type","to_id");