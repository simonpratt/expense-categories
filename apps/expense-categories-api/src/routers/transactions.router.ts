import { z } from 'zod';
import { router, authenticatedProcedure } from '../core/trpc.base';
import { addManyTransactions, getTransactionCategories } from '../services/transaction.service';

const transactionsRouter = router({
  getSummary: authenticatedProcedure.query(() => {
    return getTransactionCategories();
  }),
  addMany: authenticatedProcedure
    .input(
      z.object({
        transactions: z.array(
          z.object({
            uniqueRef: z.string(),
            description: z.string(),
            account: z.string(),
            date: z.coerce.date(),
            credit: z.coerce.number().optional().optional(),
            debit: z.coerce.number().optional().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      return addManyTransactions(input.transactions);
    }),
});

export default transactionsRouter;
