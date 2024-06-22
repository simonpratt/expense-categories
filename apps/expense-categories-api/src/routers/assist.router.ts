import { router, authenticatedProcedure } from '../core/trpc.base';

import { z } from 'zod';
import { getAutoCategoriseRecommendations, getRecommendations } from '../services/assist.service';

const assistRouter = router({
  getAutoCategoriseRecommendations: authenticatedProcedure.query(async function* () {
    yield* getAutoCategoriseRecommendations();
  }),
  searchForTransactions: authenticatedProcedure
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
