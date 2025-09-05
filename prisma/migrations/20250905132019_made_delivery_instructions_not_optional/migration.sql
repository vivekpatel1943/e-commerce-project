/*
  Warnings:

  - Added the required column `totalAmount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `deliveryInstructions` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "totalAmount" INTEGER NOT NULL,
DROP COLUMN "deliveryInstructions",
ADD COLUMN     "deliveryInstructions" JSONB NOT NULL;
