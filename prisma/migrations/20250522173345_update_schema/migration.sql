/*
  Warnings:

  - You are about to drop the `ChildProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `unlockedAt` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `chatSessionId` on the `ChatMessage` table. All the data in the column will be lost.
  - You are about to drop the column `sender` on the `ChatMessage` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `ChatMessage` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `ProgressItem` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Made the column `category` on table `Achievement` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `role` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.
  - Made the column `profileId` on table `ChatSession` required. This step will fail if there are existing NULL values in that column.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ChildProfile";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "interests" TEXT,
    "preferences" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Achievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Achievement_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Achievement" ("category", "description", "icon", "id", "profileId", "title") SELECT "category", "description", "icon", "id", "profileId", "title" FROM "Achievement";
DROP TABLE "Achievement";
ALTER TABLE "new_Achievement" RENAME TO "Achievement";
CREATE TABLE "new_ChatMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "audioBase64" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ChatMessage" ("content", "id") SELECT "content", "id" FROM "ChatMessage";
DROP TABLE "ChatMessage";
ALTER TABLE "new_ChatMessage" RENAME TO "ChatMessage";
CREATE TABLE "new_ChatSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "topicFocus" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    "duration" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChatSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChatSession_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ChatSession" ("createdAt", "duration", "endedAt", "id", "profileId", "startedAt", "topicFocus", "updatedAt", "userId") SELECT "createdAt", "duration", "endedAt", "id", "profileId", "startedAt", "topicFocus", "updatedAt", "userId" FROM "ChatSession";
DROP TABLE "ChatSession";
ALTER TABLE "new_ChatSession" RENAME TO "ChatSession";
CREATE TABLE "new_ProgressItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProgressItem_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProgressItem" ("category", "createdAt", "id", "level", "points", "profileId", "skill", "updatedAt") SELECT "category", "createdAt", "id", "level", "points", "profileId", "skill", "updatedAt" FROM "ProgressItem";
DROP TABLE "ProgressItem";
ALTER TABLE "new_ProgressItem" RENAME TO "ProgressItem";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "emailVerified", "id", "image", "name", "password", "updatedAt") SELECT "createdAt", "email", "emailVerified", "id", "image", "name", "password", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
