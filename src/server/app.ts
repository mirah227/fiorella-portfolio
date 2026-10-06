import express, { Request, Response, NextFunction } from 'express';
import { apiRouter } from './routes';

export function createExpressApp(): express.Application {
  const app = express();

  // Parse incoming JSON payloads
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Catch body-parser malformed JSON syntax errors and return valid JSON
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON request payload',
      });
    }
    next(err);
  });

  // Mount API router under /api
  app.use('/api', apiRouter);

  // Also mount directly for direct serverless function calls if /api prefix is stripped
  app.use(apiRouter);

  // Catch-all 404 for /api routes
  app.use('/api', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(404).json({
      success: false,
      message: 'API endpoint not found',
    });
  });

  // Catch-all 500 error handler guaranteeing valid JSON
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled server error:', err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({
      success: false,
      message: 'Authentication service is temporarily unavailable',
    });
  });

  return app;
}

export const app = createExpressApp();
