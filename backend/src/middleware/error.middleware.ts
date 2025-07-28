import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ValidationError } from 'class-validator';
import { ApolloError } from 'apollo-server-express';

export const notFoundHandler = (req: Request, res: Response) => {
  const message = `🔍 - Not Found - ${req.originalUrl}`;
  logger.warn(message);
  res.status(404).json({ message: 'Route not found' });};

export const errorHandler = (
  err: Error | ApolloError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error
  logger.error(err.stack);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    const validationError = err as any;
    return res.status(400).json({
      message: 'Validation Error',
      errors: validationError.errors,
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (err.name === 'ForbiddenError') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (err.name === 'NotFoundError') {
    return res.status(404).json({ message: 'Resource not found' });
  }

  // Handle Apollo errors
  if (err instanceof ApolloError) {
    return res.status(400).json({
      message: err.message,
      code: err.extensions?.code,
    });
  }

  // Default to 500 server error
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {},
  });
};

export const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
