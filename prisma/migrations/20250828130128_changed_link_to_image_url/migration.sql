/*
  Warnings:

  - You are about to drop the column `link` on the `ProductImage` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ProductImage" DROP COLUMN "link",
ADD COLUMN     "imageUrl" TEXT NOT NULL;
