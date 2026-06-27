-- Add operator settings JSON for commission rules and feature config
ALTER TABLE `operators` ADD COLUMN `settings` JSON NULL;
