import { create as createFromUseCases, list as listFromUseCases, update as patchFromUseCases, remove as removeFromUseCases } from '@/core/use-cases/task';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import { noUpdatesError } from '../../libs/constants';
import { AppRouteHandler } from '../../libs/types/app';
import { CreateRoute, ListRoute, PatchRoute, RemoveRoute } from './routes';

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const task = c.req.valid('json');
  const inserted = await createFromUseCases(task);
  return c.json(inserted, HttpStatusCodes.CREATED);
}

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const tasks = await listFromUseCases();
  return c.json(tasks);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const updates = c.req.valid('json');

  if (Object.keys(updates).length === 0) {
    return c.json(
      noUpdatesError,
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  const task = await patchFromUseCases(id, updates);
  if (!task) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(task, HttpStatusCodes.OK);
}

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid('param');

  const task = await removeFromUseCases(id);
  if (!task) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
}
