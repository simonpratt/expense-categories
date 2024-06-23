import { z } from 'zod';

const configSchema = z.object({
  CORS_ENABLED_URL: z.string(),
  SERVER_PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  ANTHROPIC_API_KEY: z.string(),
  GEOGRAPHIC_LOCATION_STRING: z.string(),
});

const environment = configSchema.parse(process.env);

export default environment;
