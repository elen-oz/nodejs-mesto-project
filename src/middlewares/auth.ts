import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors';
import { JWT_SECRET } from '../utils/constants';

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Authorization required'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload: Request['user'];

  try {
    payload = jwt.verify(token, JWT_SECRET) as Request['user'];
  } catch {
    next(new UnauthorizedError('Authorization required'));
    return;
  }

  req.user = payload;
  next();
};
