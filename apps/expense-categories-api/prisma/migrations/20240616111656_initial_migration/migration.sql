-- CreateTable
CREATE TABLE "SpendingCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SpendingCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionCategory" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalCredit" DOUBLE PRECISION NOT NULL,
    "totalDebit" DOUBLE PRECISION NOT NULL,
    "totalFrequency" DOUBLE PRECISION NOT NULL,
    "spendingCategoryId" TEXT,

    CONSTRAINT "TransactionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "uniqueRef" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "credit" DOUBLE PRECISION,
    "debit" DOUBLE PRECISION,
    "transactionCategoryId" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpendingCategory_name_key" ON "SpendingCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionCategory_description_key" ON "TransactionCategory"("description");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_uniqueRef_key" ON "Transaction"("uniqueRef");

-- AddForeignKey
ALTER TABLE "TransactionCategory" ADD CONSTRAINT "TransactionCategory_spendingCategoryId_fkey" FOREIGN KEY ("spendingCategoryId") REFERENCES "SpendingCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_transactionCategoryId_fkey" FOREIGN KEY ("transactionCategoryId") REFERENCES "TransactionCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
