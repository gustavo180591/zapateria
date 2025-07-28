import { Request, Response } from 'express';
import { User } from '../entities/User';

export interface Context {
  req: Request & { userId?: string };
  res: Response;
  user?: User;
}
