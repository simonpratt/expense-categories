import { z } from 'zod';
import { router, authenticatedProcedure } from '../core/trpc.base';
import { addManyTransactions } from '../services/transaction.service';

const transactionsRouter = router({
  getAll: authenticatedProcedure.query(() => {
    return ['abc'];
  }),
  addMany: authenticatedProcedure
    .input(
      z.object({
        transactions: z.array(
          z.object({
            uniqueRef: z.string(),
            description: z.string(),
            account: z.string(),
            date: z.string(),
            credit: z.coerce.number().optional().optional(),
            debit: z.coerce.number().optional().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await addManyTransactions(input.transactions);
    }),
});

export default transactionsRouter;
