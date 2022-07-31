-- CreateTable
CREATE TABLE `Match` (
    `id` VARCHAR(191) NOT NULL,
    `datetimeUTC` DATETIME(3) NOT NULL,
    `location` VARCHAR(191) NULL,
    `HomeTeam` VARCHAR(191) NOT NULL,
    `AwayTeam` VARCHAR(191) NOT NULL,
    `phase` VARCHAR(191) NULL,
    `status` ENUM('WAITING', 'STARTED', 'FINISHED') NOT NULL DEFAULT 'WAITING',
    `HomeTeamScore` INTEGER NOT NULL DEFAULT 0,
    `AwayTeamScore` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
