import { OpenAPIHono } from '@hono/zod-openapi';
import { requestId } from 'hono/request-id';
import notFound from '../middlewares/not-found';
import onError from '../middlewares/on-error';
import logger from '../middlewares/pino-logger';
import defaultHook from './default-hook';
import { AppBindings } from './types/app';

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    defaultHook,
    strict: false,
  });
}

export default function createApp() {
  const app = createRouter();

  app.use(requestId()).use(logger());

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
