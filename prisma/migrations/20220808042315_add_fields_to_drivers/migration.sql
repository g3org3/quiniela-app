-- DropForeignKey
ALTER TABLE `RaceDriver` DROP FOREIGN KEY `RaceDriver_raceTeamId_fkey`;

-- AlterTable
ALTER TABLE `RaceDriver` ADD COLUMN `code` VARCHAR(191) NULL,
    ADD COLUMN `dateOfBirth` VARCHAR(191) NULL,
    ADD COLUMN `nationality` VARCHAR(191) NULL,
    ADD COLUMN `permanentNumber` VARCHAR(191) NULL,
    MODIFY `raceTeamId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `RaceDriver` ADD CONSTRAINT `RaceDriver_raceTeamId_fkey` FOREIGN KEY (`raceTeamId`) REFERENCES `RaceTeam`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
