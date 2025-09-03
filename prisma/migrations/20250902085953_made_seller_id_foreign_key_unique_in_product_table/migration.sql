/*
  Warnings:

  - A unique constraint covering the columns `[sellerId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Product_sellerId_key" ON "public"."Product"("sellerId");
