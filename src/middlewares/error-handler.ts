import { Request, Response, NextFunction } from 'express';

interface IHttpError extends Error {
  statusCode?: number;
}

export default (err: IHttpError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'A server error occurred.' : message,
  });
};
