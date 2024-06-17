import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { RootRouter } from '@expense-categories/api';

type RouterOutput = inferRouterOutputs<RootRouter>;
type RouterInput = inferRouterInputs<RootRouter>;

export type Transaction = RouterOutput['app']['transactions']['getSummary'][0];
export type TransactionAddProps = RouterInput['app']['transactions']['addMany']['transactions'][0];
export type SpendingCategory = RouterInput['app']['categories']['getCategories'][0];
