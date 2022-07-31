-- AlterTable
ALTER TABLE `Match` ADD COLUMN `awayTeamImage` TEXT NULL,
    ADD COLUMN `homeTeamImage` TEXT NULL;

-- AlterTable
ALTER TABLE `Tournament` ADD COLUMN `isRace` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `status` ENUM('ACTIVE', 'BUILDING', 'FINISHED') NOT NULL DEFAULT 'BUILDING';

-- CreateTable
CREATE TABLE `Race` (
    `id` VARCHAR(191) NOT NULL,
    `startsAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `circuit` VARCHAR(191) NOT NULL,
    `image` TEXT NULL,
    `tournamentId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RaceTeam` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RaceDriver` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `formula1TeamId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Race` ADD CONSTRAINT `Race_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `Tournament`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RaceDriver` ADD CONSTRAINT `RaceDriver_formula1TeamId_fkey` FOREIGN KEY (`formula1TeamId`) REFERENCES `RaceTeam`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
