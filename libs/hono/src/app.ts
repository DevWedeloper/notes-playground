import configureOpenAPI from './libs/configure-open-api';
import createApp from './libs/create-app';
import index from './routes';
import tasks from './routes/tasks';

const app = createApp();

const routes = [index, tasks] as const;

configureOpenAPI(app);

routes.forEach((route) => app.route('/', route));

export type AppType = typeof routes[number];

export default app;
