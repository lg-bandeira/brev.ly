CREATE TABLE "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"short_code" text,
	"views" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "links_short_code_unique" UNIQUE("short_code")
);
