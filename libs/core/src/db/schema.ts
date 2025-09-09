import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { toZodV4SchemaTyped } from '../utils/zod';

export const tasks = sqliteTable('tasks', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  done: integer({ mode: 'boolean' }).notNull().default(false),
  createdAt: integer({ mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer({ mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export const selectTasksSchema = toZodV4SchemaTyped(createSelectSchema(tasks));

export const insertTasksSchema = toZodV4SchemaTyped(createInsertSchema(tasks, {
  name: (field) => field.min(1).max(200),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}));

export const patchTasksSchema = toZodV4SchemaTyped(createUpdateSchema(tasks, {
  name: (field) => field.min(1).max(200),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}));
