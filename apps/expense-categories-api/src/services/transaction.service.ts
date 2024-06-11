import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addManyTransactions = async (transactions: any) => {
  const createdTransactions = await prisma.transaction.createMany({
    data: transactions,
  });
  return createdTransactions;
};

export const getAllTransactions = async () => {
  return await prisma.transaction.findMany();
};
