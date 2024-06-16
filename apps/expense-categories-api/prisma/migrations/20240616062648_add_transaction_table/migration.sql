-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL,
    "uniqueRef" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "credit" DOUBLE PRECISION,
    "debit" DOUBLE PRECISION,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transaction_uniqueRef_key" ON "transaction"("uniqueRef");
