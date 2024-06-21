import { router, authenticatedProcedure } from '../core/trpc.base';

import Anthropic from '@anthropic-ai/sdk';
import { TRPCError } from '@trpc/server';
import environment from '../core/environment';
import { z } from 'zod';
import { jsonHelpers } from '../helpers/jsonHelpers';
import { prisma } from '../core/prisma.client';
import { generateCategorisationPrompt } from '../prompts/categorisation.prompt';

const client = new Anthropic({
  apiKey: environment.ANTHROPIC_API_KEY,
});

const TransactionSchema = z.object({
  description: z.string(),
  confidence: z.string(),
});

const assistRouter = router({
  streamStory: authenticatedProcedure.query(async function* () {
    const transactions = await prisma.transactionCategory.findMany({ take: 1000 });
    const categories = await prisma.spendingCategory.findMany();

    try {
      const stream = await client.messages.stream({
        messages: [
          {
            role: 'user',
            content: generateCategorisationPrompt(
              transactions.map((tx) => tx.description),
              categories.map((c) => c.name),
              'Takeaway',
            ),
          },
        ],
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1024,
      });

      yield* jsonHelpers.extractAndYieldObjects(stream, TransactionSchema);
    } catch (error) {
      console.error('Error in streamStory:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while generating the story',
      });
    }
  }),
});

export default assistRouter;
