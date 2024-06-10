import { router, authenticatedProcedure } from '../core/trpc.base';

const transactionsRouter = router({
  getAll: authenticatedProcedure.query(() => {
    return ['abc'];
  }),
});

export default transactionsRouter;
