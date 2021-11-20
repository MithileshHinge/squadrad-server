import { NextFunction, Request, Response } from 'express';
import { findCreator } from '../../creator';
import { HTTPResponseCode } from '../HttpResponse';

export default async function creatorAuthorizationMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated() || !req.user || !req.user.userId) return res.status(HTTPResponseCode.UNAUTHORIZED).json({});
  const creator = await findCreator.findCreatorPage(req.user.userId, true);
  if (!creator) return res.status(HTTPResponseCode.FORBIDDEN).json({});
  return next();
}
