import express, { Request, Response } from 'express';
import { hasKey } from '../common/helpers';
import handleExpressRequest from './handleExpressRequest';
import routes from './routes';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

routes.forEach((route) => {
  const { path, ...controllers } = route;
  Object.entries(controllers).forEach(([method, controller]) => {
    if (hasKey(app, method)) {
      app[method](path, async (req: Request, res: Response) => {
        await handleExpressRequest(req, res, controller);
      });
    }
  });
});

export default app;
