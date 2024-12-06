import { Hono, type Context } from 'hono';
import { etag } from 'hono/etag';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { cors } from 'hono/cors';
import apiRouter from './src/routes/router';
import { streamSSE } from 'hono/streaming';

const app = new Hono();

app.use('*', etag(), logger());
app.use('*', prettyJSON());
app.use('*', cors());

app.get('/', (c) => {
  return c.json({
    message: 'Welcome To Hono Api!',
  });
});

app.mount('/api', apiRouter.fetch);
app.notFound((c) => c.json({ message: 'Not Found' }, 400));

export default {
  port: 5000,
  fetch: app.fetch,
};
