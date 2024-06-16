import { prisma } from '../core/prisma.client';
import { Prisma } from '../generated/client';

export const addManyTransactions = async (transactions: Prisma.transactionCreateManyInput[]) => {
  const createdTransactions = await prisma.transaction.createMany({
    data: transactions.map((tx) => ({
      ...tx,
      credit: tx.credit ? Math.abs(tx.credit) : null,
      debit: tx.debit ? Math.abs(tx.debit) : null,
    })),
    skipDuplicates: true,
  });
  return createdTransactions;
};

export const getAllTransactions = async () => {
  return await prisma.transaction.findMany();
};
