import { router, authenticatedProcedure } from '../core/trpc.base';

const transactionsRouter = router({
  getAll: authenticatedProcedure.query(() => {
    return ['abc'];
  }),
  addMany: authenticatedProcedure
    .input(z.array(z.object({
      id: z.string().uuid(),
      uniqueRef: z.string().optional(),
      description: z.string(),
      account: z.string().default('everyday'),
      date: z.date(),
      credit: z.number().optional(),
      debit: z.number().optional(),
    })))
    .mutation(async ({ input, ctx }) => {
      const createdTransactions = await ctx.prisma.transaction.createMany({
        data: input,
      });
      return createdTransactions;
    }),
});

export default transactionsRouter;
