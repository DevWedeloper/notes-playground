import { drizzle } from 'drizzle-orm/libsql';
import env from '../../env';
import nodeFetch from "node-fetch";

const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
    fetch: async (request: Request) => {
      const decoder = new TextDecoder();
      let body = "{}";
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for await (const chunk of request.body!) {
        body = decoder.decode(chunk);
      }
      return nodeFetch(request.url, {
        method: "post",
        headers: Object.fromEntries([...request.headers.entries()]),
        body,
      });
    },
  },
  casing: 'snake_case',
});

export default db;
