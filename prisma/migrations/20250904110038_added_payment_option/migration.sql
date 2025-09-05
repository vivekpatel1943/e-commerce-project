/*
  Warnings:

  - Added the required column `paymentOption` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "paymentOption" JSONB NOT NULL;
