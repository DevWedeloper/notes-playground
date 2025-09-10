import configureOpenAPI from './libs/configure-open-api';
import createApp from './libs/create-app';
import index from './routes';
import tasks from './routes/tasks';

const app = createApp();

const routes = [index, tasks];

configureOpenAPI(app);

routes.forEach((route) => app.route('/', route));

export default app;
