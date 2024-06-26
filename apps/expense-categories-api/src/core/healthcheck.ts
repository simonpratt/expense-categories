import { expressHealthCheckFactory, registerHealthCheckDependency } from '@expense-categories/healthcheck';

import { prisma } from './prisma.client';

registerHealthCheckDependency({
  name: 'postgres',
  type: 'database',
  check: async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;

      return {
        status: 'healthy',
      };
    } catch (err) {
      return {
        status: 'unhealthy',
        message: 'Failed to connect to postgres',
        error: err,
      };
    }
  },
});

const configureExpressHealthCheck = expressHealthCheckFactory();

export { configureExpressHealthCheck };
