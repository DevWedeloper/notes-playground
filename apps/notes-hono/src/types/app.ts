import type { BaseLogger } from 'pino';

export type AppBindings = {
  Variables: {
    logger: BaseLogger;
  };
};
