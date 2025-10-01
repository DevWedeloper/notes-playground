import { serve } from '@hono/node-server';
import app from '@/hono';

const port = 8787;
console.log(`Server is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
