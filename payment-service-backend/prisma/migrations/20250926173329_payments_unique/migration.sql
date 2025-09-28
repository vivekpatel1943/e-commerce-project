/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payments_orderId_key" ON "public"."Payments"("orderId");
