/*
  Warnings:

  - You are about to drop the column `datetimeUTC` on the `Match` table. All the data in the column will be lost.
  - Added the required column `startsAt` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Match` DROP COLUMN `datetimeUTC`,
    ADD COLUMN `startsAt` DATETIME(3) NOT NULL;
