import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import express from 'express';
import pino from 'pino';
import createLogger from 'pino';
import pinoHttp from 'pino-http';

import { createContext } from './core/context';
import environment from './core/environment';
import errors from './core/errors';
import { configureExpressHealthCheck } from './core/healthcheck';
import { router } from './core/trpc.base';
import transactionsRouter from './routers/transactions.router';
import categoriesRouter from './routers/category.router';

const logger = createLogger().child({ name: 'server' });

const appRouter = router({
  transactions: transactionsRouter,
  categories: categoriesRouter,
});

const rootRouter = router({
  app: appRouter,
});

export type RootRouter = typeof rootRouter;

export default rootRouter;

export const startServer = async () => {
  const app = express();
  app.use(
    pinoHttp({
      autoLogging: {
        ignore: (req) => {
          return req.url.includes('healthz') ? true : false;
        },
      },
      serializers: {
        req: pino.stdSerializers.wrapRequestSerializer((r) => {
          delete (r as any)['headers'];
          return r;
        }),
      },
    }),
  );

  // Health check
  configureExpressHealthCheck(app);

  // CORS Config
  const whitelist = environment.CORS_ENABLED_URL.split(',');
  const corsOptions = {
    origin: function (origin: string, callback: any) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new errors.CrossOriginError('Not allowed by CORS'));
      }
    },
    credentials: true,
  };
  app.use(cors(corsOptions as any));

  app.use(
    '/',
    trpcExpress.createExpressMiddleware({
      router: rootRouter,
      async createContext(ctx) {
        const authToken = ctx.req.headers.authorization?.split(' ')[1];

        return createContext(authToken!);
      },
      onError({ path, error }) {
        logger.error({ path, error }, 'Error in TRPC');
      },
    }),
  );
  const server = app.listen(environment.SERVER_PORT, () => {
    logger.info(`Server listening on port ${environment.SERVER_PORT}`);
  });

  const shutdown = () => {
    logger.info('Received kill signal, shutting down gracefully');
    server.close(() => {
      logger.info('Closed out remaining connections');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};
