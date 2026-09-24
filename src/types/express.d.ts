/**
 * Adds `req.user` to the Express request type.
 * The auth middleware puts the JWT payload (the current user's `_id`) there.
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
