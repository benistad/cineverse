CREATE TABLE IF NOT EXISTS films (
  "id" varchar PRIMARY KEY NOT NULL,
  "tmdb_id" integer,
  "title" varchar,
  "slug" varchar,
  "synopsis" varchar,
  "poster_url" varchar,
  "backdrop_url" varchar,
  "note_sur_10" integer,
  "youtube_trailer_key" text,
  "date_ajout" timestamp with time zone,
  "created_at" timestamp with time zone,
  "why_watch_enabled" boolean,
  "why_watch_content" text,
  "release_date" date,
  "genres" varchar,
  "is_hidden_gem" boolean
);