/*
  Warnings:

  - The `role` column on the `Worker` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "WorkerRoles" AS ENUM ('receptionist', 'doctor');

-- AlterTable
ALTER TABLE "Worker" DROP COLUMN "role",
ADD COLUMN     "role" "WorkerRoles" NOT NULL DEFAULT 'receptionist';
