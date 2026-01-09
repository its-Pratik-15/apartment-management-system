-- DropForeignKey
ALTER TABLE "visitor_logs" DROP CONSTRAINT "visitor_logs_guardId_fkey";

-- AlterTable
ALTER TABLE "visitor_logs" ADD COLUMN     "hostId" TEXT,
ALTER COLUMN "guardId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "visitor_logs_hostId_idx" ON "visitor_logs"("hostId");

-- AddForeignKey
ALTER TABLE "visitor_logs" ADD CONSTRAINT "visitor_logs_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_logs" ADD CONSTRAINT "visitor_logs_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
