/*
  Warnings:

  - You are about to drop the column `organisation_id` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `organisation_id` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `organisation_id` on the `Type` table. All the data in the column will be lost.
  - You are about to drop the `Organisation` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[organization_id]` on the table `Banner` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organization_id` to the `Banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Banner" DROP CONSTRAINT "Banner_organisation_id_fkey";

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_organisation_id_fkey";

-- DropForeignKey
ALTER TABLE "Organisation" DROP CONSTRAINT "Organisation_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "Type" DROP CONSTRAINT "Type_organisation_id_fkey";

-- DropIndex
DROP INDEX "Banner_organisation_id_key";

-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "organisation_id",
ADD COLUMN     "organization_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "organisation_id",
ADD COLUMN     "organization_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Type" DROP COLUMN "organisation_id",
ADD COLUMN     "organization_id" INTEGER;

-- DropTable
DROP TABLE "Organisation";

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unique_name" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "pincode" TEXT NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bannerId" INTEGER,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_unique_name_key" ON "Organization"("unique_name");

-- CreateIndex
CREATE UNIQUE INDEX "Banner_organization_id_key" ON "Banner"("organization_id");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Type" ADD CONSTRAINT "Type_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
