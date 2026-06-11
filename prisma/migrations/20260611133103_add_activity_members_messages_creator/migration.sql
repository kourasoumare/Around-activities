/*
  Warnings:

  - Added the required column `creator_id` to the `activities` table without a default value. This is not possible if the table is not empty.
  - Made the column `city` on table `activities` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "creator_id" INTEGER NOT NULL,
ALTER COLUMN "city" SET NOT NULL;

-- CreateTable
CREATE TABLE "activity_members" (
    "id" SERIAL NOT NULL,
    "activity_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_messages" (
    "id" SERIAL NOT NULL,
    "activity_id" INTEGER NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "activity_members_activity_id_user_id_key" ON "activity_members"("activity_id", "user_id");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "activity_members" ADD CONSTRAINT "activity_members_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_members" ADD CONSTRAINT "activity_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_messages" ADD CONSTRAINT "activity_messages_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_messages" ADD CONSTRAINT "activity_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
