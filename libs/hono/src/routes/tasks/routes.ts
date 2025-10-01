import { insertTasksSchema, patchTasksSchema, selectTasksSchema } from '@/core/db/schema';
import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from "stoker/http-status-codes";
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';
import { createCustomErrorSchema, notFoundSchema, noUpdatesError } from '../../libs/constants';

const tags = ['Tasks'];

export const create = createRoute({
  path: '/tasks',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: insertTasksSchema
        },
      },
      description: 'The task to create',
      required: true,
    }
  },
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: {
      content: {
        'application/json': {
          schema: selectTasksSchema,
        },
      },
      description: 'The created task',
    },
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: {
      content: {
        'application/json': {
          schema: createErrorSchema(insertTasksSchema),
        }
      },
      description: 'The validation error(s)',
    }
  },
});

export const list = createRoute({
  path: '/tasks',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        'application/json': {
          schema: z.array(selectTasksSchema),
        },
      },
      description: 'The list of tasks',
    },
  },
});

export const patch = createRoute({
  path: '/tasks/{id}',
  method: 'patch',
  request: {
    params: IdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: patchTasksSchema,
        },
      },
      description: 'The task updates',
      required: true,
    }
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        'application/json': {
          schema: selectTasksSchema,
        },
      },
      description: 'The updated task',
    },
    [HttpStatusCodes.NOT_FOUND]: {
      content: {
        'application/json': {
          schema: notFoundSchema,
        },
      },
      description: 'Task not found',
    },
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: {
      content: {
        'application/json': {
          schema: createErrorSchema(patchTasksSchema)
            .or(createErrorSchema(IdParamsSchema))
            .or(createCustomErrorSchema(noUpdatesError)),
        }
      },
      description: 'The validation error(s)',
    }
  },
});

export const remove = createRoute({
  path: '/tasks/{id}',
  method: 'delete',
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Task deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: {
      content: {
        'application/json': {
          schema: notFoundSchema,
        },
      },
      description: 'Task not found',
    },
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: {
      content: {
        'application/json': {
          schema: createErrorSchema(IdParamsSchema),
        }
      },
      description: 'Invalid id error',
    }
  },
});

export type CreateRoute = typeof create;
export type ListRoute = typeof list;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
