/*
  Warnings:

  - A unique constraint covering the columns `[vault_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vault_address]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `vault_address` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `vault_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_vault_id_key` ON `User`(`vault_id`);

-- CreateIndex
CREATE UNIQUE INDEX `User_vault_address_key` ON `User`(`vault_address`);
