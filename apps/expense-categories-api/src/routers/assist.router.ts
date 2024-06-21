import { router, authenticatedProcedure } from '../core/trpc.base';

import { z } from 'zod';
import { getRecommendations } from '../services/assist.service';

const assistRouter = router({
  getRecommendations: authenticatedProcedure
    .input(
      z.object({
        spendingCategoryId: z.string(),
      }),
    )
    .query(async function* ({ input }) {
      yield* getRecommendations(input.spendingCategoryId);
    }),
});

export default assistRouter;
