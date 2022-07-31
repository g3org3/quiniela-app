/*
  Warnings:

  - You are about to drop the column `AwayTeam` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `AwayTeamScore` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `HomeTeam` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `HomeTeamScore` on the `Match` table. All the data in the column will be lost.
  - Added the required column `awayTeam` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `homeTeam` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Match` DROP COLUMN `AwayTeam`,
    DROP COLUMN `AwayTeamScore`,
    DROP COLUMN `HomeTeam`,
    DROP COLUMN `HomeTeamScore`,
    ADD COLUMN `awayTeam` VARCHAR(191) NOT NULL,
    ADD COLUMN `awayTeamScore` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `homeTeam` VARCHAR(191) NOT NULL,
    ADD COLUMN `homeTeamScore` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
