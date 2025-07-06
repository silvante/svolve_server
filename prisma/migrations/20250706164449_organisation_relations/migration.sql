/*
  Warnings:

  - Added the required column `owner_id` to the `Organisation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Organisation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organisation" ADD COLUMN     "owner_id" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Organisation" ADD CONSTRAINT "Organisation_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
