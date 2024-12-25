import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { ZodError } from 'zod';

/**
 * Error handling middleware for Express.
 * Handles different error types and sends appropriate responses to the client.
 */
function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  let statusCode = 500;
  let message = 'An internal server error occurred.';

  if (createHttpError.isHttpError(err)) {
    statusCode = err.status || 500;
    message = err.message || 'An error occurred.';
  }

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    res.status(statusCode).json({
      status: 'error',
      message,
      details: err.errors.map((error) => ({
        path: error.path.join('.'),
        message: error.message,
      })),
    });
    return;
  }

  if (err instanceof Error && 'name' in err && err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Database Validation Error';
    res.status(statusCode).json({
      status: 'error',
      message,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      details: (err as any).errors,
    });
    return;
  }

  if (err instanceof Error) {
    message = err.message || message;
  }

  res.status(statusCode).json({
    status: 'error',
    message,
  });
}

export default errorHandler;
