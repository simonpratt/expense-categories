import { z } from 'zod';
import { router, authenticatedProcedure } from '../core/trpc.base';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../services/categories.service';

const categoriesRouter = router({
  getCategories: authenticatedProcedure.query(() => {
    return getCategories();
  }),
  addCategory: authenticatedProcedure
    .input(
      z.object({
        name: z.string(),
        colour: z.string(),
        description: z.string(),
      }),
    )
    .mutation(({ input }) => {
      return addCategory(input);
    }),
  updateCategory: authenticatedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        colour: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return updateCategory(input);
    }),
  deleteCategory: authenticatedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return deleteCategory(input.id);
    }),
});

export default categoriesRouter;
