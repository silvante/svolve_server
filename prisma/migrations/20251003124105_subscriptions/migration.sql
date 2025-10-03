-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_vip" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "renews_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "subscribed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "subscription_id" TEXT NOT NULL DEFAULT 'not_subscribed',
ADD COLUMN     "subscription_status" TEXT NOT NULL DEFAULT 'not_subscribed';
