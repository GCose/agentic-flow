-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "sendType" TEXT NOT NULL,
    "targetGroup" TEXT NOT NULL,
    "schedule" DATETIME,
    "status" TEXT NOT NULL,
    "attachment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_UserNotifications" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UserNotifications_A_fkey" FOREIGN KEY ("A") REFERENCES "Notification" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserNotifications_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserNotifications_AB_unique" ON "_UserNotifications"("A", "B");

-- CreateIndex
CREATE INDEX "_UserNotifications_B_index" ON "_UserNotifications"("B");
