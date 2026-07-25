import { describe, expect, it } from 'vitest';
import { HttpError } from './httpError';

describe('HttpError', () => {
  it('carries its status and message', () => {
    const error = new HttpError(418, 'I am a teapot');
    expect(error.status).toBe(418);
    expect(error.message).toBe('I am a teapot');
  });

  it('is a real Error, so it survives throw/catch and instanceof', () => {
    expect(() => {
      throw HttpError.notFound();
    }).toThrow(Error);

    try {
      throw HttpError.forbidden('nope');
    } catch (caught) {
      expect(caught).toBeInstanceOf(HttpError);
      expect((caught as HttpError).status).toBe(403);
    }
  });

  it.each([
    ['badRequest', 400],
    ['unauthorized', 401],
    ['forbidden', 403],
    ['notFound', 404],
    ['conflict', 409],
  ] as const)('%s maps to %i', (factory, status) => {
    expect(HttpError[factory]().status).toBe(status);
  });

  it('never exposes a stack in its serialised form', () => {
    // The error middleware relies on `message` alone; a stack must never reach
    // a client, which the old Google-login handler did explicitly.
    const error = HttpError.badRequest('bad input');
    expect(JSON.stringify({ error: error.message })).toBe('{"error":"bad input"}');
  });
});
