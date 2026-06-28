-- Add featured pinning for creator public profiles
ALTER TABLE "creator_links" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "creator_links" ADD COLUMN "featuredOrder" INTEGER;
