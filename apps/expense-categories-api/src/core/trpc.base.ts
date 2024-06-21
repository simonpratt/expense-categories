import { initTRPC } from '@trpc/server';

import { UserContext } from './context';

export const t = initTRPC.context<UserContext>().create({ experimental: { iterablesAndDeferreds: true } });

export const router = t.router;

const middleware = t.middleware;
export const publicProcedure = t.procedure;

const isAuthenticated = middleware(async (opts) => {
  const { ctx } = opts;

  return opts.next({
    ctx,
  });
});

export const authenticatedProcedure = publicProcedure.use(isAuthenticated);
