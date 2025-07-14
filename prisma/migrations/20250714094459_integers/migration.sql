/*
  Warnings:

  - Changed the type of `born_in` on the `Client` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "born_in",
ADD COLUMN     "born_in" INTEGER NOT NULL;
