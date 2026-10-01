import express from 'express';
import { apiRouter } from './routes';

export function createExpressApp(): express.Application {
  const app = express();

  // Parse incoming JSON payloads
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Mount API Router
  app.use('/api', apiRouter);

  return app;
}

export const app = createExpressApp();
