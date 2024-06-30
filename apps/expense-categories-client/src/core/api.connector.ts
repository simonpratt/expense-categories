import { RootRouter } from '@expense-categories/api';
import { createTRPCReact } from '@trpc/react-query';

export const apiConnector = createTRPCReact<RootRouter>();
