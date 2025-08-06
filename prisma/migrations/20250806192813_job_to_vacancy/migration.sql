/*
  Warnings:

  - Added the required column `job` to the `Vacancy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vacancy" ADD COLUMN     "job" TEXT NOT NULL;
