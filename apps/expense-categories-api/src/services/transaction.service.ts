import { prisma } from '../core/prisma.client';

const sum = (...numbers: number[]) => {
  let initial = 0;
  numbers.forEach((num) => (initial += num));
  return initial;
};

export interface RawTransaction {
  uniqueRef: string;
  account: string;
  description: string;
  date: Date;
  credit?: number;
  debit?: number;
}

// Note: This function is very heavy on the DB and process memory
// If it ever gets scaled it's likely to blow up
export const addManyTransactions = async (transactions: RawTransaction[]) => {
  const uniqueDescriptions = transactions
    .map((tx) => tx.description)
    .filter((desc, index, arr) => arr.indexOf(desc) === index);

  // Create any missing categories and then get the list
  await prisma.transactionCategory.createMany({
    data: uniqueDescriptions.map((desc) => ({
      description: desc,
      totalCredit: 0,
      totalDebit: 0,
      totalFrequency: 0,
    })),
    skipDuplicates: true,
  });
  const categories = await prisma.transactionCategory.findMany();

  // Create all the transactions
  await prisma.transaction.createMany({
    data: transactions.map((tx) => {
      const categoryId = categories.find((c) => c.description === tx.description)?.id;

      if (!categoryId) {
        throw new Error('Unexpected error when finding category');
      }

      return {
        uniqueRef: tx.uniqueRef,
        account: tx.account,
        date: tx.date,
        credit: tx.credit ? Math.abs(tx.credit) : null,
        debit: tx.debit ? Math.abs(tx.debit) : null,
        transactionCategoryId: categoryId,
      };
    }),
    skipDuplicates: true,
  });

  await recomputeSummaries();
};

// Note: This function is very heavy on the DB and process memory
// If it ever gets scaled it's likely to blow up
export const recomputeSummaries = async () => {
  const categories = await prisma.transactionCategory.findMany({ include: { Transaction: true } });

  for (const category of categories) {
    await prisma.transactionCategory.update({
      where: { id: category.id },
      data: {
        totalCredit: sum(...category.Transaction.map((tx) => tx.credit || 0)),
        totalDebit: sum(...category.Transaction.map((tx) => tx.debit || 0)),
        totalFrequency: category.Transaction.length,
      },
    });
  }
};

export const getAllTransactions = async () => {
  return await prisma.transaction.findMany();
};
