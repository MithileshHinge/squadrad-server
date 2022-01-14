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

function getFilesIfExist(req: Request) {
  function isFileArray(files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] }): files is Express.Multer.File[] {
    return (files.constructor.name === 'Array');
  }

  if (req.file) return [req.file.filename];
  if (req.files) {
    if (isFileArray(req.files)) return req.files.map((file) => file.filename);
    return Object.values(req.files).flat().map((file) => file.filename);
  }
  return undefined;
}

export default async function handleExpressRequest(
  req: Request,
  res: Response,
  controller: IBaseController,
) {
  const files = getFilesIfExist(req);

  const httpRequest = {
    body: req.body,
    query: req.query,
    params: req.params,
    method: req.method as HTTPRequestMethod,
    path: req.path,
    userId: req.user ? req.user.userId : undefined,
    files,
  };
  if (process.env.NODE_ENV !== 'test') console.log(`${httpRequest.method} ${req.url} : userId=${httpRequest.userId} : body=${JSON.stringify(httpRequest.body)}`);
  const httpResponse = await controller(httpRequest);
  if (httpResponse.file) return res.sendFile(httpResponse.file, { root: `${__dirname}/../../` });
  if (httpResponse.statusCode) return res.status(httpResponse.statusCode).json(httpResponse.body);
  throw new Error('Invalid httpResponse');
}
