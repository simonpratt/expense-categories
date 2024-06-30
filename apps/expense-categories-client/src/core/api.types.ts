import { RootRouter } from '@expense-categories/api';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

type RouterOutput = inferRouterOutputs<RootRouter>;
type RouterInput = inferRouterInputs<RootRouter>;

export type Transaction = RouterOutput['app']['transactions']['getTransactions'][0];
export type TransactionSummary = RouterOutput['app']['transactions']['getTransactionSummaries'][0];
export type TransactionAddProps = RouterInput['app']['transactions']['addMany']['transactions'][0];
export type SpendingCategory = RouterOutput['app']['categories']['getCategories'][0];
