-- AlterTable
ALTER TABLE `Race` ADD COLUMN `firstPlaceDriverId` VARCHAR(191) NULL,
    ADD COLUMN `secondPlaceDriverId` VARCHAR(191) NULL,
    ADD COLUMN `thirdPlaceDriverId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Race` ADD CONSTRAINT `Race_firstPlaceDriverId_fkey` FOREIGN KEY (`firstPlaceDriverId`) REFERENCES `RaceDriver`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Race` ADD CONSTRAINT `Race_secondPlaceDriverId_fkey` FOREIGN KEY (`secondPlaceDriverId`) REFERENCES `RaceDriver`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Race` ADD CONSTRAINT `Race_thirdPlaceDriverId_fkey` FOREIGN KEY (`thirdPlaceDriverId`) REFERENCES `RaceDriver`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
