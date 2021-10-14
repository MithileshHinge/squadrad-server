import passport from 'passport';
import {
  Express, NextFunction, Request, Response,
} from 'express';
import { Strategy as LocalStrategy } from 'passport-local';
import { findUser, loginUser } from '../../user';
import AuthenticationError from '../../common/errors/AuthenticationError';
import { HTTPResponseCode } from '../HttpResponse';
import ValidationError from '../../common/errors/ValidationError';

function initializeLocalStrategy() {
  passport.serializeUser((user: any, done) => {
    done(null, user.userId);
  });

  passport.deserializeUser((userId: string, done) => {
    findUser.findUserById(userId).then((user) => {
      if (!user) done(new AuthenticationError(`User with userId "${userId}" not found`));
      done(null, user);
    });
  });

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, (email, password, done) => {
    loginUser.login({ email, password }).then((user) => done(null, user))
      .catch((err) => {
        done(err);
      });
  }));
}

function localAuthenticationMiddleware(req: Request, res: Response, next: NextFunction) {
  const customAuthenticator = passport.authenticate('local', (useCaseErr, user) => {
    if (useCaseErr || !user) {
      if (useCaseErr instanceof AuthenticationError) {
        return res.status(HTTPResponseCode.UNAUTHORIZED).json({});
      }
      if (useCaseErr instanceof ValidationError) {
        return res.status(HTTPResponseCode.FORBIDDEN).json({});
      }
      return next(useCaseErr);
    }
    req.login(user, (passportErr) => {
      if (passportErr) return next(passportErr);
      return res.status(HTTPResponseCode.OK).json(user);
    });
    return null;
  });

  customAuthenticator(req, res, next);
}

export default function initializePassport(app: Express) {
  app.use(passport.initialize());
  app.use(passport.session());

  initializeLocalStrategy();

  app.post('/user/login', localAuthenticationMiddleware);
}
