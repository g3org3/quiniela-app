/*
  Warnings:

  - Made the column `raceTeamId` on table `RaceDriver` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `RaceDriver` DROP FOREIGN KEY `RaceDriver_raceTeamId_fkey`;

-- AlterTable
ALTER TABLE `RaceDriver` MODIFY `raceTeamId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `RaceDriver` ADD CONSTRAINT `RaceDriver_raceTeamId_fkey` FOREIGN KEY (`raceTeamId`) REFERENCES `RaceTeam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
