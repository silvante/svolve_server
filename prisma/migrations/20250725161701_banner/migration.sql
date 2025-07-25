/*
  Warnings:

  - You are about to drop the column `banner` on the `Organisation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organisation" DROP COLUMN "banner",
ADD COLUMN     "bannerId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT;

-- CreateTable
CREATE TABLE "Banner" (
    "id" SERIAL NOT NULL,
    "original" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "organisation_id" INTEGER NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Banner_organisation_id_key" ON "Banner"("organisation_id");

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
