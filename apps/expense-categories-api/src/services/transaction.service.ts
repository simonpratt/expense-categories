import { prisma } from '../core/prisma.client';
import { TransactionCategory } from '../generated/client';

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

export const getTransactions = async (startDate: Date, endDate: Date) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      debit: { not: null },
      TransactionCategory: { ignored: false },
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: { TransactionCategory: true },
  });

  return transactions.map((tx) => ({
    id: tx.id,
    account: tx.account,
    debit: tx.debit,
    date: tx.date,
    spendingCategoryId: tx.TransactionCategory.spendingCategoryId,
  }));
};

export const getTransactionSummaries = async (startDate: Date, endDate: Date) => {
  const transactionsWithCategories = await prisma.transaction.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      TransactionCategory: true,
    },
  });

  const categorySummaries = transactionsWithCategories.reduce(
    (acc, transaction) => {
      const categoryId = transaction.transactionCategoryId;
      if (!acc[categoryId]) {
        acc[categoryId] = {
          id: categoryId,
          description: transaction.TransactionCategory.description,
          totalCredit: 0,
          totalDebit: 0,
          totalFrequency: 0,
          ignored: transaction.TransactionCategory.ignored,
          spendingCategoryId: transaction.TransactionCategory.spendingCategoryId,
        };
      }

      acc[categoryId].totalCredit += transaction.credit || 0;
      acc[categoryId].totalDebit += transaction.debit || 0;
      acc[categoryId].totalFrequency += 1;

      return acc;
    },
    {} as Record<string, TransactionCategory>,
  );

  return Object.values(categorySummaries).sort((a, b) => b.totalDebit - a.totalDebit);
  // return prisma.transactionCategory.findMany({ orderBy: { totalDebit: 'desc' } });
};

export const assignSpendingCategory = async (transactionCategoryId: string, spendingCategoryId?: string) => {
  const transactionCategory = await prisma.transactionCategory.update({
    where: { id: transactionCategoryId },
    data: { ignored: false, spendingCategoryId: spendingCategoryId || null },
  });
  return transactionCategory;
};

export const bulkAssignSpendingCategory = async (transactionCategoryIds: string[], spendingCategoryId?: string) => {
  const transactionCategories = await prisma.transactionCategory.updateMany({
    where: { id: { in: transactionCategoryIds } },
    data: { ignored: false, spendingCategoryId: spendingCategoryId || null },
  });
  return transactionCategories;
};

export const ignoreTransactionSummary = async (transactionCategoryId: string) => {
  const transactionCategory = await prisma.transactionCategory.update({
    where: { id: transactionCategoryId },
    data: { ignored: true, spendingCategoryId: null },
  });
  return transactionCategory;
};
