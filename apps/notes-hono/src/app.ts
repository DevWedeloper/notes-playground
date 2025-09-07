import { OpenAPIHono } from '@hono/zod-openapi';
import { requestId } from 'hono/request-id';
import notFound from './middlewares/not-found';
import onError from './middlewares/on-error';
import logger from './middlewares/pino-logger';
import { AppBindings } from './libs/types/app';

const app = new OpenAPIHono<AppBindings>();

app.use(requestId());
app.use(logger());

app.get('/', (c) => c.text('Hello Node.js!'));

app.notFound(notFound);

app.onError(onError);

export default app;
