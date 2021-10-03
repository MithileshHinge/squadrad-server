import { Request, Response } from 'express';
import { IBaseController } from './controllers/IBaseController';
import { HTTPRequestMethod } from './HttpRequest';

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
  };
  const httpResponse = await controller(httpRequest);
  return res.status(httpResponse.statusCode).json(httpResponse.body);
}
