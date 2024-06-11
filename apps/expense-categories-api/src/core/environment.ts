import { z } from 'zod';

const configSchema = z.object({
  CORS_ENABLED_URL: z.string(),
  SERVER_PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
});

const environment = configSchema.parse(process.env);

export default environment;