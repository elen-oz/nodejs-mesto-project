/**
 * Adds `req.user` to the Express request type.
 * The middleware in `app.ts` puts the current user's `_id` there.
 */
declare global {
  namespace Express {
    interface Request {
      user: {
        _id: string;
      };
    }
  }
}

export {};
