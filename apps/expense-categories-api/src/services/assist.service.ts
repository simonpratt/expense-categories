import Anthropic from '@anthropic-ai/sdk';
import environment from '../core/environment';
import { z } from 'zod';
import { jsonHelpers } from '../helpers/jsonHelpers';
import { prisma } from '../core/prisma.client';
import { generateCategorisationPrompt } from '../prompts/categorisation.prompt';
import { TRPCError } from '@trpc/server';

const client = new Anthropic({
  apiKey: environment.ANTHROPIC_API_KEY,
});

const TransactionSchema = z.object({
  description: z.string(),
  confidence: z.string(),
});

interface getRecommendationsOutput {
  id: string;
  description: string;
  totalDebit: number;
  totalFrequency: number;
  confidence: string;
}

export async function* getRecommendations(spendingCategoryId: string): AsyncGenerator<getRecommendationsOutput> {
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
        content: generateCategorisationPrompt(
          transactions.map((tx) => tx.description),
          categories.map((c) => c.name),
          selectedCategory.name,
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
