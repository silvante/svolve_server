/*
  Warnings:

  - You are about to drop the column `owner_id` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `client_count` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_owner_id_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "owner_id";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "client_count";
