import { prisma } from '../core/prisma.client';

export const getCategories = async () => {
  return prisma.spendingCategory.findMany();
};

export const addCategory = async (category: { name: string; colour: string }) => {
  return prisma.spendingCategory.create({
    data: {
      name: category.name,
      colour: category.colour,
    },
  });
};

export const updateCategory = async (category: { id: string; name: string; colour: string }) => {
  return prisma.spendingCategory.update({
    where: { id: category.id },
    data: {
      name: category.name,
      colour: category.colour,
    },
  });
};

export const deleteCategory = async (id: string) => {
  return prisma.spendingCategory.delete({
    where: { id },
  });
};
