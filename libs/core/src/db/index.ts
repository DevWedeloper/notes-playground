import { drizzle } from 'drizzle-orm/libsql';
import env from '../../env';

const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
  casing: 'snake_case',
});

export default db;
