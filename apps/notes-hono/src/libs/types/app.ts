import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { BaseLogger } from 'pino';

export type AppBindings = {
  Variables: {
    logger: BaseLogger;
  };
};

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;
