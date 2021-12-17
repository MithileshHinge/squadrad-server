import express, { Request, Response } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import { hasKey } from '../common/helpers';
import { COOKIE_SECRET } from '../common/secretKeys';
import handleExpressRequest from './handleExpressRequest';
import routes from './routes';
import initializePassport from './services/passport.service';
import razorpayService from './services/razorpay.service';
import getStore from './services/store.service';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: COOKIE_SECRET,
  name: 'sessionId',
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
  store: getStore(),

  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true,
}));

initializePassport(app);

app.use(express.static('public'));

razorpayService.createInstance();

routes.forEach((route) => {
  const { path, ...controllers } = route;
  Object.entries<any>(controllers).forEach(([method, middlewares]: [string, Array<any>]) => {
    if (hasKey(app, method)) {
      const [controller] = middlewares.splice(middlewares.length - 1, 1);
      app[method](path, middlewares, async (req: Request, res: Response) => {
        await handleExpressRequest(req, res, controller);
      });
    }
  });
});

app.use(helmet());

export default app;
