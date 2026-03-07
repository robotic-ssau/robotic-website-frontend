import type { Request, Response, NextFunction } from 'express';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authorization header is missing',
    });
  }

  // Простая проверка формата токена
  const token = authHeader.replace('Bearer ', '');

  if (!token || token.length < 10) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token format',
    });
  }

  // Здесь можно добавить проверку токена, но для мока просто пропускаем
  next();
}
