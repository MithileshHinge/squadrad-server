import express, { Request, Response } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import { hasKey } from '../common/helpers';
import { COOKIE_SECRET } from '../common/secretKeys';
import getMockStore from '../__tests__/__mocks__/api/mockStore';
import handleExpressRequest from './handleExpressRequest';
import routes from './routes';
import initializePassport from './services/passport.service';
import getStore from './services/store.service';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: COOKIE_SECRET,
  name: 'sessionId',
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'test',
    sameSite: 'strict',
  },
  store: process.env.NODE_ENV === 'test' ? getMockStore() : getStore(),

  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true,
}));
app.use(helmet());

initializePassport(app);

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
