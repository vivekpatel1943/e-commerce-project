-- CreateTable
CREATE TABLE "public"."Payments" (
    "id" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "buyerId" INTEGER NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);
