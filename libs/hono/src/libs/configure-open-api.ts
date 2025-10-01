import { Scalar } from '@scalar/hono-api-reference';
import { AppOpenAPI } from './types/app';

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Tasks API',
    },
  });

  app.get(
    '/scalar',
    Scalar({
      url: '/doc',
      defaultHttpClient: {
        targetKey: 'js',
        clientKey: 'fetch',
      },
    }),
  );
}
