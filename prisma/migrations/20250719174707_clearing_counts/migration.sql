/*
  Warnings:

  - You are about to drop the column `client_count` on the `Organisation` table. All the data in the column will be lost.
  - You are about to drop the column `type_count` on the `Organisation` table. All the data in the column will be lost.
  - You are about to drop the column `client_count` on the `Type` table. All the data in the column will be lost.
  - You are about to drop the column `organisation_count` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organisation" DROP COLUMN "client_count",
DROP COLUMN "type_count";

-- AlterTable
ALTER TABLE "Type" DROP COLUMN "client_count";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "organisation_count";
