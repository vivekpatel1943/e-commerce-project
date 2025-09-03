-- CreateTable
CREATE TABLE "public"."Address" (
    "id" TEXT NOT NULL,
    "building" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "State" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "buyerId" INTEGER NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Address" ADD CONSTRAINT "Address_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "public"."Buyer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
