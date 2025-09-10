import { eq } from 'drizzle-orm';
import { z } from 'zod';
import db from '../db/index';
import { insertTasksSchema, patchTasksSchema, tasks } from '../db/schema';

export const create = async (data: z.infer<typeof insertTasksSchema>) =>
  db.insert(tasks).values(data).returning().get();

export const list = async () => db.select().from(tasks).all();

export const update = async (
  id: number,
  data: z.infer<typeof patchTasksSchema>,
) => {
  const res = await db.update(tasks)
    .set(data)
    .where(eq(tasks.id, id))
    .returning()
    .get();

  return res ? res : undefined;
};

export const remove = async (id: number) =>
  db.delete(tasks).where(eq(tasks.id, id)).returning().get();
