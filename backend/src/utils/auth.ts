import { sign, verify, SignOptions } from 'jsonwebtoken';
import { User } from '../entities/User';

export const createAccessToken = (user: User): string => {
  return sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '15m' } as SignOptions
  );
};

export const createRefreshToken = (user: User): string => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion || 0 },
    process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret',
    { expiresIn: '7d' } as SignOptions
  );
};

export const verifyAccessToken = (token: string): any => {
  return verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
};

export const verifyRefreshToken = (token: string): any => {
  return verify(
    token,
    process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret'
  );
};
