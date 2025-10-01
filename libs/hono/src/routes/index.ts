import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from "stoker/http-status-codes";
import { createRouter } from '../libs/create-app';

const router = createRouter().openapi(
  createRoute({
    tags: ['Index'],
    method: 'get',
    path: '/',
    responses: {
      [HttpStatusCodes.OK]: {
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
        description: 'Tasks API Index',
      },
    },
  }),
  (c) => c.json({ message: 'Tasks API' }),
);

export default router;