-- Add imagePosition column to Trainer table
-- Default 50 = center (equivalent to object-position: center 50%)
ALTER TABLE "Trainer" ADD COLUMN IF NOT EXISTS "imagePosition" INTEGER NOT NULL DEFAULT 50;
