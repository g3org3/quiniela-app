/*
  Warnings:

  - Made the column `userId` on table `RaceBet` required. This step will fail if there are existing NULL values in that column.
  - Made the column `raceId` on table `RaceBet` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `RaceBet` DROP FOREIGN KEY `RaceBet_raceId_fkey`;

-- DropForeignKey
ALTER TABLE `RaceBet` DROP FOREIGN KEY `RaceBet_userId_fkey`;

-- AlterTable
ALTER TABLE `RaceBet` MODIFY `userId` VARCHAR(191) NOT NULL,
    MODIFY `raceId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `RaceBet` ADD CONSTRAINT `RaceBet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RaceBet` ADD CONSTRAINT `RaceBet_raceId_fkey` FOREIGN KEY (`raceId`) REFERENCES `Race`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
