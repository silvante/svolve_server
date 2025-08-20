-- DropForeignKey
ALTER TABLE "WorkerAttachedType" DROP CONSTRAINT "WorkerAttachedType_worker_id_fkey";

-- AddForeignKey
ALTER TABLE "WorkerAttachedType" ADD CONSTRAINT "WorkerAttachedType_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
