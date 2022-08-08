-- DropForeignKey
ALTER TABLE `Race` DROP FOREIGN KEY `Race_tournamentId_fkey`;

-- DropForeignKey
ALTER TABLE `Race` DROP FOREIGN KEY `Race_userId_fkey`;

-- AlterTable
ALTER TABLE `Race` MODIFY `tournamentId` VARCHAR(191) NULL,
    MODIFY `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Race` ADD CONSTRAINT `Race_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `Tournament`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Race` ADD CONSTRAINT `Race_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
