/*
  Warnings:

  - You are about to drop the column `userId` on the `role` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `role` DROP FOREIGN KEY `Role_userId_fkey`;

-- AlterTable
ALTER TABLE `role` DROP COLUMN `userId`,
    MODIFY `axcess` VARCHAR(191) NOT NULL DEFAULT 'NULL';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `roleId` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
