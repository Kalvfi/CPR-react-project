/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Card` table. All the data in the column will be lost.
  - Added the required column `imageKey` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "imageUrl",
ADD COLUMN     "imageKey" TEXT NOT NULL;
