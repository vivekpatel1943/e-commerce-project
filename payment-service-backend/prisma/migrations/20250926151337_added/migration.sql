/*
  Warnings:

  - Added the required column `isPaymentSuccessfull` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Payments" ADD COLUMN     "isPaymentSuccessfull" BOOLEAN NOT NULL;
