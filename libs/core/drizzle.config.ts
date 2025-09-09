import { defineConfig } from 'drizzle-kit';
import env from './env';

export default defineConfig({
  schema: './libs/core/src/db/schema.ts',
  out: './libs/core/src/db/migrations',
  dialect: 'turso',
  casing: 'snake_case',
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
});
