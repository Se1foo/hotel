import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { verifyAccessToken } from '../utils/token';
import { HttpError } from '../utils/httpError';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

/**
 * Requires a valid bearer access token.
 *
 * Typed as `RequestHandler` so routers accept it directly. Call sites previously
 * needed `verifyToken as any` (and `handler as any` alongside it) because a
 * narrowed `AuthenticatedRequest` parameter isn't assignable to Express'
 * `RequestHandler` — and those casts silently disabled type checking on the
 * handlers they were applied to.
 */
export const verifyToken: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next(HttpError.unauthorized('Access token missing or malformed'));
    return;
  }

  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) {
    next(HttpError.unauthorized('Access token missing or malformed'));
    return;
  }

  try {
    (req as AuthenticatedRequest).user = verifyAccessToken(token);
    next();
  } catch {
    next(HttpError.unauthorized('Invalid or expired access token'));
  }
};

/**
 * Attaches the user when a valid token is present but lets the request through
 * either way — for routes that tailor their response to a signed-in viewer
 * without requiring one.
 */
export const attachUser: RequestHandler = (req: Request, _res, next): void => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      (req as AuthenticatedRequest).user = verifyAccessToken(
        authHeader.slice('Bearer '.length).trim(),
      );
    } catch {
      // An invalid token on an optional-auth route is simply treated as anonymous.
    }
  }
  next();
};
