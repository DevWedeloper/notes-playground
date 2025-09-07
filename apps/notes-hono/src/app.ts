import createApp from './libs/create-app';

const app = createApp();

app.get('/', (c) => c.text('Hello Node.js!'));

export default app;
