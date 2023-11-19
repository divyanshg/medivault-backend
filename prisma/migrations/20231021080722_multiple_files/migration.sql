/*
  Warnings:

  - You are about to drop the column `file_url` on the `records` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `records` DROP COLUMN `file_url`;

-- CreateTable
CREATE TABLE `File` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `record_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `record_id`(`record_id`),
    INDEX `mime_type`(`mimeType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_record_id_fkey` FOREIGN KEY (`record_id`) REFERENCES `Records`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
