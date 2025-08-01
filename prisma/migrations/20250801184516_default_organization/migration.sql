-- CreateTable
CREATE TABLE "DefaultOrganization" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "organization_id" INTEGER NOT NULL,

    CONSTRAINT "DefaultOrganization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DefaultOrganization_owner_id_key" ON "DefaultOrganization"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "DefaultOrganization_organization_id_key" ON "DefaultOrganization"("organization_id");

-- AddForeignKey
ALTER TABLE "DefaultOrganization" ADD CONSTRAINT "DefaultOrganization_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefaultOrganization" ADD CONSTRAINT "DefaultOrganization_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
