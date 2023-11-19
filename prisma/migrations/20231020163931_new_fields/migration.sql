/*
  Warnings:

  - Made the column `vault_id` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `vault_id` VARCHAR(191) NOT NULL;
