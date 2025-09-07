import { MiddlewareHandler } from 'hono';
import pino from 'pino';
import pinoHttp from 'pino-http';
import env from '../env';

const loggerInstance = pino(
  {
    level: env.LOG_LEVEL || 'info',
  },
  env.NODE_ENV === 'production'
    ? undefined
    : pino.transport({ target: 'pino-pretty' }),
);

const pinoLogger = (): MiddlewareHandler => {
  return async (c, next) => {
    c.env.incoming.id = c.var.requestId;

    // Wrap the request/response using pino-http
    await new Promise<void>((resolve) => {
      pinoHttp({ logger: loggerInstance })(c.env.incoming, c.env.outgoing, () =>
        resolve(),
      );
    });

    // Store logger instance for this request
    c.set('logger', c.env.incoming.log);

    await next();
  };
};

export default pinoLogger;
