import { createTRPCReact } from '@trpc/react-query';
import { RootRouter } from '@expense-categories/api';

export const apiConnector = createTRPCReact<RootRouter>();
