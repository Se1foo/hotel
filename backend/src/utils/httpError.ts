/**
 * An error carrying an HTTP status, so handlers can `throw` instead of
 * hand-writing `res.status(...).json(...)` in every branch and remembering to
 * `return`. The error middleware turns these into safe client responses.
 */
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }

  static badRequest(message = 'Bad request') {
    return new HttpError(400, message);
  }

  static unauthorized(message = 'Authentication required') {
    return new HttpError(401, message);
  }

  static forbidden(message = 'You do not have permission to do that') {
    return new HttpError(403, message);
  }

  static notFound(message = 'Not found') {
    return new HttpError(404, message);
  }

  static conflict(message = 'Conflict') {
    return new HttpError(409, message);
  }
}
