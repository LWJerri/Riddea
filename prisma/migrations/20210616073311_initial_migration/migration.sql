-- CreateTable
CREATE TABLE IF NOT EXISTS "collections" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "sessions" (
    "id" SERIAL NOT NULL,
    "expireAt" BIGINT NOT NULL,
    "sid" VARCHAR NOT NULL,
    "json" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "statistics" (
    "id" SERIAL NOT NULL,
    "command" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "uploads" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "fileID" TEXT NOT NULL,
    "collectionId" INTEGER,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "IDX_4c1989542e47d9e3b98fe32c67" ON "sessions"("expireAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "IDX_e2d6172ca19b8ebef797c362b0" ON "sessions"("sid");

-- AddForeignKey
ALTER TABLE "uploads" ADD FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE;
