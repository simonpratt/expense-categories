import { router, authenticatedProcedure } from '../core/trpc.base';

import Anthropic from '@anthropic-ai/sdk';
import { TRPCError } from '@trpc/server';
import environment from '../core/environment';

const client = new Anthropic({
  apiKey: environment.ANTHROPIC_API_KEY,
});

const assistRouter = router({
  streamStory: authenticatedProcedure.query(async function* () {
    try {
      const stream = await client.messages.stream({
        messages: [{ role: 'user', content: 'Tell me a story about a space adventure' }],
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta') {
          yield chunk.delta.text;
        }
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
