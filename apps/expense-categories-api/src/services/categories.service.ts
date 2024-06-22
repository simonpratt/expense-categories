import { prisma } from '../core/prisma.client';

const defaultCategories = [
  {
    name: 'Groceries',
    description:
      "Expenses for food and household items typically bought at supermarkets, grocery stores, and farmers' markets.",
    colour: 'green',
  },
  {
    name: 'Dining Out',
    description: 'Costs associated with eating at restaurants, cafes, food trucks, or ordering takeout/delivery.',
    colour: 'yellow',
  },
  {
    name: 'Transportation',
    description:
      'Expenses related to getting around, including public transit, fuel, car maintenance, ride-sharing services, and parking fees.',
    colour: 'blue',
  },
  {
    name: 'Shopping (General Retail)',
    description:
      'Purchases of non-grocery items like clothing, electronics, books, and other general merchandise from department stores or online retailers.',
    colour: 'purple',
  },
  {
    name: 'Utilities',
    description: 'Regular bills for essential services such as electricity, water, gas, internet, and phone.',
    colour: 'red',
  },
  {
    name: 'Entertainment',
    description:
      'Costs for leisure activities, including movies, concerts, streaming services, hobbies, and sports events.',
    colour: 'yellow',
  },
  {
    name: 'Health & Wellness',
    description:
      'Expenses related to maintaining health, including gym memberships, medical co-pays, prescriptions, and personal care items.',
    colour: 'green',
  },
  {
    name: 'Home Improvement',
    description:
      'Costs associated with maintaining or upgrading your living space, including repairs, renovations, and purchases from hardware stores.',
    colour: 'blue',
  },
  {
    name: 'Travel',
    description:
      'Expenses incurred during trips, including airfare, hotel stays, car rentals, and activities while on vacation.',
    colour: 'yellow',
  },
  {
    name: 'Education',
    description: 'Costs related to learning, such as tuition fees, textbooks, online courses, and school supplies.',
    colour: 'purple',
  },
];

export const getCategories = async () => {
  const categories = await prisma.spendingCategory.findMany();

  if (!categories.length) {
    await prisma.spendingCategory.createMany({ data: defaultCategories });
  }

  return prisma.spendingCategory.findMany();
};

export const addCategory = async (category: { name: string; colour: string; description: string }) => {
  return prisma.spendingCategory.create({
    data: {
      name: category.name,
      colour: category.colour,
      description: category.description,
    },
  });
};

export const updateCategory = async (category: { id: string; name: string; description: string; colour: string }) => {
  return prisma.spendingCategory.update({
    where: { id: category.id },
    data: {
      name: category.name,
      colour: category.colour,
      description: category.description,
    },
  });
};

export const deleteCategory = async (id: string) => {
  // First, clear the categoryId from any transactionCategories
  await prisma.transactionCategory.updateMany({
    where: { spendingCategoryId: id },
    data: { spendingCategoryId: null },
  });

  // Then delete the category
  return prisma.spendingCategory.delete({
    where: { id },
  });
};
