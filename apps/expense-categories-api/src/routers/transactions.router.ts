import { z } from 'zod';
import { router, authenticatedProcedure } from '../core/trpc.base';
import {
  addManyTransactions,
  assignSpendingCategory,
  bulkAssignSpendingCategory,
  getTransactionSummaries,
  getTransactions,
  ignoreTransactionSummary,
} from '../services/transaction.service';

const transactionsRouter = router({
  getTransactions: authenticatedProcedure
    .input(
      z.object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
      }),
    )
    .query(({ input }) => {
      return getTransactions(input.startDate, input.endDate);
    }),
  getTransactionSummaries: authenticatedProcedure
    .input(
      z.object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
      }),
    )
    .query(({ input }) => {
      return getTransactionSummaries(input.startDate, input.endDate);
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
  assignSpendingCategory: authenticatedProcedure
    .input(
      z.object({
        transactionCategoryId: z.string(),
        spendingCategoryId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return assignSpendingCategory(input.transactionCategoryId, input.spendingCategoryId);
    }),
  bulkAssignSpendingCategory: authenticatedProcedure
    .input(
      z.object({
        transactionCategoryIds: z.array(z.string()),
        spendingCategoryId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return bulkAssignSpendingCategory(input.transactionCategoryIds, input.spendingCategoryId);
    }),
  ignoreTransactionSummary: authenticatedProcedure
    .input(
      z.object({
        transactionCategoryId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return ignoreTransactionSummary(input.transactionCategoryId);
    }),
});

export default transactionsRouter;
