-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "toUserId" INTEGER NOT NULL,
    "fromUserId" INTEGER,
    "type" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_toUserId_createdAt_idx" ON "Notification"("toUserId", "createdAt");
