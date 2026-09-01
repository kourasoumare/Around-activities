-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "is_recurring" BOOLEAN DEFAULT false,
ADD COLUMN     "recurrence_count" INTEGER,
ADD COLUMN     "recurrence_frequency" VARCHAR(20);
