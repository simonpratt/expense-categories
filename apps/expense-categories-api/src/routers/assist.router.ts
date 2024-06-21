import { router, authenticatedProcedure } from '../core/trpc.base';

import Anthropic from '@anthropic-ai/sdk';
import { TRPCError } from '@trpc/server';
import environment from '../core/environment';
import { z } from 'zod';
import { parseJsonBuffer } from '../helpers/parseJsonBuffer';

const client = new Anthropic({
  apiKey: environment.ANTHROPIC_API_KEY,
});

const CarModelSchema = z.object({
  brand: z.string(),
  model: z.string(),
  year: z.number(),
});

const assistRouter = router({
  streamStory: authenticatedProcedure.query(async function* () {
    try {
      const stream = await client.messages.stream({
        messages: [
          {
            role: 'user',
            content:
              'Generate a JSON array of 20 car models. Each object should have brand, model, and year properties. Provide only the JSON array, no additional text.',
          },
        ],
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1024,
      });

      let jsonBuffer = '';

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta') {
          jsonBuffer += chunk.delta.text;

          const { remainingBuffer, objects: carModels } = parseJsonBuffer(jsonBuffer, CarModelSchema);
          jsonBuffer = remainingBuffer;

          for (const carModel of carModels) {
            yield carModel;
          }
        }
      }

      // Process any remaining data in the buffer
      const { objects: carModels } = parseJsonBuffer(jsonBuffer, CarModelSchema);
      for (const carModel of carModels) {
        yield carModel;
      }
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
