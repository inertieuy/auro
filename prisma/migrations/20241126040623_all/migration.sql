/*
  Warnings:

  - You are about to drop the column `accountId` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `rxName` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `txName` on the `transaction` table. All the data in the column will be lost.
  - Added the required column `rxaccountId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `txaccountId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_accountId_fkey`;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `accountId`,
    DROP COLUMN `rxName`,
    DROP COLUMN `txName`,
    ADD COLUMN `rxaccountId` VARCHAR(191) NOT NULL,
    ADD COLUMN `txaccountId` VARCHAR(191) NOT NULL;
