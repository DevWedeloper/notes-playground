import { OpenAPIHono } from '@hono/zod-openapi';
import type { Schema } from "hono";
import { requestId } from 'hono/request-id';
import notFound from '../middlewares/not-found';
import onError from '../middlewares/on-error';
import logger from '../middlewares/pino-logger';
import defaultHook from './default-hook';
import { AppBindings, AppOpenAPI } from './types/app';
import { cors } from 'hono/cors';

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    defaultHook,
    strict: false,
  });
}

export default function createApp() {
  const app = createRouter();

  app.use('*', cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }));

  app.use(requestId()).use(logger());

  app.notFound(notFound);
  app.onError(onError);

  return app;
}

export function createTestApp<S extends Schema>(router: AppOpenAPI<S>) {
  return createApp().route("/", router);
}
