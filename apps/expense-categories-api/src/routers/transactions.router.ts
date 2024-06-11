import { router, authenticatedProcedure } from '../core/trpc.base';
import { addManyTransactions } from '../services/transaction.service';

const transactionsRouter = router({
  getAll: authenticatedProcedure.query(() => {
    return ['abc'];
  }),
  addMany: authenticatedProcedure
    .input(z.array(z.object({
      id: z.string().uuid(),
      uniqueRef: z.string().optional(),
      description: z.string(),
      date: z.date(),
      credit: z.number().optional(),
      debit: z.number().optional(),
    })))
    .mutation(async ({ input, ctx }) => {
      return await addManyTransactions(input);
    }),
});

export default transactionsRouter;
