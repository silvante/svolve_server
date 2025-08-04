/*
  Warnings:

  - Added the required column `origin` to the `Vacancy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vacancy" ADD COLUMN     "origin" TEXT NOT NULL;
