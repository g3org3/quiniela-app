/*
  Warnings:

  - Made the column `tournamentId` on table `Race` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Race` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Race` DROP FOREIGN KEY `Race_tournamentId_fkey`;

-- DropForeignKey
ALTER TABLE `Race` DROP FOREIGN KEY `Race_userId_fkey`;

-- AlterTable
ALTER TABLE `Race` ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `round` VARCHAR(191) NULL,
    MODIFY `tournamentId` VARCHAR(191) NOT NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Race` ADD CONSTRAINT `Race_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `Tournament`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Race` ADD CONSTRAINT `Race_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
