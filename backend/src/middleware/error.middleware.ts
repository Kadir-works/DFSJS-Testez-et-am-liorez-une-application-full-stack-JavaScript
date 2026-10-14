import { ErrorRequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../errors/app-error';

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next): void => {
  console.error(error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    res.status(400).json({ message: 'A record with these values already exists' });
    return;
  }

  res.status(500).json({ message: 'Internal server error' });
};