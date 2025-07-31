/*
  Warnings:

  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PostToTag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_PostToTag` DROP FOREIGN KEY `_PostToTag_A_fkey`;

-- DropForeignKey
ALTER TABLE `_PostToTag` DROP FOREIGN KEY `_PostToTag_B_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'USER',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `Tag`;

-- DropTable
DROP TABLE `_PostToTag`;
