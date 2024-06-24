import { router, authenticatedProcedure } from '../core/trpc.base';

import { z } from 'zod';
import { getAutoCategoriseRecommendations, getRecommendations } from '../services/assist.service';

const assistRouter = router({
  getAutoCategoriseRecommendations: authenticatedProcedure
    .input(
      z.object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
      }),
    )
    .query(async function* ({ input }) {
      yield* getAutoCategoriseRecommendations(input.startDate, input.endDate);
    }),
  searchForTransactions: authenticatedProcedure
    .input(
      z.object({
        spendingCategoryId: z.string(),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
      }),
    )
    .query(async function* ({ input }) {
      yield* getRecommendations(input.spendingCategoryId, input.startDate, input.endDate);
    }),
});

export default assistRouter;
