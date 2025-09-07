import { OpenAPIHono } from '@hono/zod-openapi';
import { requestId } from 'hono/request-id';
import notFound from '../middlewares/not-found';
import onError from '../middlewares/on-error';
import logger from '../middlewares/pino-logger';
import { AppBindings } from './types/app';

export default function createApp() {
  const app = new OpenAPIHono<AppBindings>();

  app.use(requestId()).use(logger());

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
