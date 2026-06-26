ALTER TABLE `operators` ADD COLUMN `stripeConnectId` VARCHAR(191) NULL;
ALTER TABLE `operators` ADD COLUMN `stripeConnectOnboardedAt` DATETIME(3) NULL;
CREATE UNIQUE INDEX `operators_stripeConnectId_key` ON `operators`(`stripeConnectId`);

ALTER TABLE `storefronts` ADD COLUMN `publishableKey` VARCHAR(191) NULL;
ALTER TABLE `storefronts` ADD COLUMN `secretKeyHash` VARCHAR(191) NULL;
ALTER TABLE `storefronts` ADD COLUMN `allowedOrigins` JSON NULL;
CREATE UNIQUE INDEX `storefronts_publishableKey_key` ON `storefronts`(`publishableKey`);
