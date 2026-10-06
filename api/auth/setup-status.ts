import { app } from '../../src/server/app';

export default function handler(req: any, res: any) {
  try {
    return app(req, res);
  } catch (err) {
    console.error('API /auth/setup-status error:', err);
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({
        success: false,
        message: 'Authentication service is temporarily unavailable',
      });
    }
  }
}
