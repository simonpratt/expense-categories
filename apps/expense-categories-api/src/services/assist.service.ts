import Anthropic from '@anthropic-ai/sdk';
import environment from '../core/environment';
import { z } from 'zod';
import { jsonHelpers } from '../helpers/jsonHelpers';
import { prisma } from '../core/prisma.client';
import { TRPCError } from '@trpc/server';
import { generateAutoCategorisationPrompt, generateTransactionSearchPrompt } from '../prompts/categorisation.prompt';

const client = new Anthropic({
  apiKey: environment.ANTHROPIC_API_KEY,
});

const TransactionSchema = z.object({
  description: z.string(),
  confidence: z.string(),
});

const CategorisedTransactionSchema = z.object({
  description: z.string(),
  category: z.string(),
  confidence: z.string(),
});

export interface TransactionSearchOutput {
  id: string;
  description: string;
  totalDebit: number;
  totalFrequency: number;
  confidence: string;
}

export interface AutoCategoriseRecommendationsOutput {
  id: string;
  description: string;
  totalDebit: number;
  totalFrequency: number;
  spendingCategoryId: string;
  confidence: string;
}

export async function* getAutoCategoriseRecommendations(): AsyncGenerator<AutoCategoriseRecommendationsOutput> {
  const transactions = await prisma.transactionCategory.findMany({
    where: { ignored: false, spendingCategoryId: null },
    orderBy: { totalDebit: 'desc' },
    take: 10,
  });
  const categories = await prisma.spendingCategory.findMany();

  const stream = await client.messages.stream({
    messages: [
      {
        role: 'user',
        content: generateAutoCategorisationPrompt(
          transactions.map((tx) => tx.description),
          categories,
        ),
      },
    ],
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 1024,
  });

  for await (const chunk of jsonHelpers.extractAndYieldObjects(stream, CategorisedTransactionSchema)) {
    const matchingTransaction = transactions.find((tx) => tx.description === chunk.description);
    const matchingCategory = categories.find((category) => category.name === chunk.category);

    if (matchingTransaction && matchingCategory) {
      yield {
        id: matchingTransaction.id,
        description: chunk.description,
        totalDebit: matchingTransaction.totalDebit,
        totalFrequency: matchingTransaction.totalFrequency,
        spendingCategoryId: matchingCategory.id,
        confidence: chunk.confidence,
      };
    }
  }
}

export async function* getRecommendations(spendingCategoryId: string): AsyncGenerator<TransactionSearchOutput> {
  const transactions = await prisma.transactionCategory.findMany({
    where: { ignored: false, spendingCategoryId: null },
    orderBy: { totalDebit: 'desc' },
    take: 1000,
  });
  const categories = await prisma.spendingCategory.findMany();

  const selectedCategory = categories.find((c) => c.id === spendingCategoryId);

  if (!selectedCategory) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid id' });
  }

  const stream = await client.messages.stream({
    messages: [
      {
        role: 'user',
        content: generateTransactionSearchPrompt(
          transactions.map((tx) => tx.description),
          categories,
          selectedCategory,
        ),
      },
    ],
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 1024,
  });

  for await (const chunk of jsonHelpers.extractAndYieldObjects(stream, TransactionSchema)) {
    const matchingTransaction = transactions.find((tx) => tx.description === chunk.description);

    if (matchingTransaction) {
      yield {
        id: matchingTransaction.id,
        description: chunk.description,
        totalDebit: matchingTransaction.totalDebit,
        totalFrequency: matchingTransaction.totalFrequency,
        confidence: chunk.confidence,
      };
    }
  }
}
