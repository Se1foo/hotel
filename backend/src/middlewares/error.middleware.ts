import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { HttpError } from '../utils/httpError';

/**
 * Terminal error handler.
 *
 * Never serialises `err.stack` into a response. The Google login handler used to
 * return `{ error, details, stack }` on failure, handing internal file paths and
 * call frames to any client that could trigger an exception. It also no longer
 * echoes arbitrary `err.message` for 5xx — an unexpected driver or library error
 * can carry connection strings.
 */
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  // Once headers are sent, only Express' default handler can close the response.
  if (res.headersSent) {
    next(err);
    return;
  }

  let status = 500;
  let message = 'Internal server error';
  let details: unknown;

  if (err instanceof HttpError) {
    status = err.status;
    message = err.message;
  } else if (err instanceof ZodError) {
    status = 400;
    message = 'Invalid request payload';
    details = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  } else if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = 'Invalid request payload';
  } else if (err instanceof mongoose.Error.CastError) {
    status = 400;
    message = 'Malformed identifier';
  } else if (
    typeof err === 'object' &&
    err !== null &&
    (err as { code?: number }).code === 11000
  ) {
    status = 409;
    message = 'That record already exists';
  }

  // Server faults are logged in full but reported generically.
  if (status >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl}`, err);
  }

  res.status(status).json({
    error: message,
    ...(details ? { details } : {}),
  });
}
