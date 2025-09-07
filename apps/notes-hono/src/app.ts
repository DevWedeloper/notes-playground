import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from 'hono/logger';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

const app = new OpenAPIHono();

app.use(logger());

app.get('/', (c) => c.text('Hello Node.js!'));

app.get('/error', () => {
  throw new Error('This is a test error');
});

app.notFound((c) =>
  c.json(
    {
      message: `${ReasonPhrases.NOT_FOUND} - ${c.req.path}`,
    },
    StatusCodes.NOT_FOUND,
  ),
);

app.onError((err, c) => {
  const currentStatus =
    'status' in err ? err.status : c.newResponse(null).status;
  const statusCode =
    currentStatus !== StatusCodes.OK
      ? (currentStatus as ContentfulStatusCode)
      : StatusCodes.INTERNAL_SERVER_ERROR;
  const env = c.env['NODE_ENV'] || process.env.NODE_ENV;

  return c.json(
    {
      message: err.message,
      stack: env === 'production' ? undefined : err.stack,
    },
    statusCode,
  );
});

export default app;
