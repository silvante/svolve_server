-- CreateTable
CREATE TABLE "WorkerAttachedType" (
    "id" SERIAL NOT NULL,
    "type_id" INTEGER NOT NULL,
    "worker_id" INTEGER NOT NULL,

    CONSTRAINT "WorkerAttachedType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkerAttachedType" ADD CONSTRAINT "WorkerAttachedType_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerAttachedType" ADD CONSTRAINT "WorkerAttachedType_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
