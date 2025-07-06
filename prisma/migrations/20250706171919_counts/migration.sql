/*
  Warnings:

  - Added the required column `pincode` to the `Organisation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organisation" ADD COLUMN     "pincode" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "organisation_count" INTEGER NOT NULL DEFAULT 0;
