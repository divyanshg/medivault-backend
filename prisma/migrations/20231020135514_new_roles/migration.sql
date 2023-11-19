-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('admin', 'user', 'doctor', 'hospital', 'insurance', 'pharmacy', 'lab', 'dentist') NOT NULL DEFAULT 'user';
