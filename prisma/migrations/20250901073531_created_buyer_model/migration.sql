-- CreateTable
CREATE TABLE "public"."Buyer" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Buyer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_username_key" ON "public"."Buyer"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_email_key" ON "public"."Buyer"("email");
