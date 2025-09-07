import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from 'hono/logger';
import notFound from './middlewares/not-found';
import onError from './middlewares/on-error';

const app = new OpenAPIHono();

app.use(logger());

app.get('/', (c) => c.text('Hello Node.js!'));

app.notFound(notFound);

app.onError(onError);

export default app;
