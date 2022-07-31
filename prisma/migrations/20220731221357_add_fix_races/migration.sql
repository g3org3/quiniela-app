/*
  Warnings:

  - You are about to drop the column `formula1TeamId` on the `RaceDriver` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `RaceDriver` DROP FOREIGN KEY `RaceDriver_formula1TeamId_fkey`;

-- AlterTable
ALTER TABLE `RaceDriver` DROP COLUMN `formula1TeamId`,
    ADD COLUMN `raceTeamId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `RaceBet` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `raceId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RaceBet` ADD CONSTRAINT `RaceBet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RaceBet` ADD CONSTRAINT `RaceBet_raceId_fkey` FOREIGN KEY (`raceId`) REFERENCES `Race`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RaceDriver` ADD CONSTRAINT `RaceDriver_raceTeamId_fkey` FOREIGN KEY (`raceTeamId`) REFERENCES `RaceTeam`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
