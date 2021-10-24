import { Request, Response } from 'express';
import { IBaseController } from './controllers/IBaseController';
import { HTTPRequestMethod } from './HttpRequest';

declare global {
  namespace Express {
    interface User {
      userId: string;
    }
  }
}

export default async function handleExpressRequest(
  req: Request,
  res: Response,
  controller: IBaseController,
) {
  const httpRequest = {
    body: req.body,
    query: req.query,
    params: req.params,
    method: req.method as HTTPRequestMethod,
    path: req.path,
    userId: req.user ? req.user.userId : undefined,
  };
  if (process.env.NODE_ENV !== 'test') console.log(`${httpRequest.method} ${req.url} : userId=${httpRequest.userId} : body=${JSON.stringify(httpRequest.body)}`);
  const httpResponse = await controller(httpRequest);
  return res.status(httpResponse.statusCode).json(httpResponse.body);
}
