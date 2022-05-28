/*
  Warnings:

  - You are about to drop the column `roleId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_roleId_fkey`;

-- AlterTable
ALTER TABLE `role` MODIFY `axcess` VARCHAR(191) NOT NULL DEFAULT 'NULL';

-- AlterTable
ALTER TABLE `user` DROP COLUMN `roleId`,
    ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'user';
