import passport from 'passport';
import {
  Express, NextFunction, Request, Response,
} from 'express';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as YoutubeStrategy } from 'passport-youtube-v3';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../../common/secretKeys';
import { addUser, findUser, loginUser } from '../../user';
import AuthenticationError from '../../common/errors/AuthenticationError';
import { HTTPResponseCode } from '../HttpResponse';
import ValidationError from '../../common/errors/ValidationError';
import config from '../../config';

function initializeLocalStrategy() {
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
    if (useCaseErr) {
      if (useCaseErr instanceof AuthenticationError) {
        return res.status(HTTPResponseCode.UNAUTHORIZED).json({});
      }
      if (useCaseErr instanceof ValidationError) {
        return res.status(HTTPResponseCode.FORBIDDEN).json({});
      }
      return next(useCaseErr);
    }
    if (!user) return res.status(HTTPResponseCode.UNAUTHORIZED).json({});
    req.login(user, (passportErr) => {
      if (passportErr) return next(passportErr);
      return res.status(HTTPResponseCode.OK).json(user);
    });
    return null;
  });

  customAuthenticator(req, res, next);
}

function initializeGoogleStrategy() {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${config.baseDomain}/api/auth/google/redirect`,
    scope: ['email', 'profile'],
    state: true,
  }, (accessToken, refreshToken, profile, cb) => {
    if (profile.emails) {
      const email = profile.emails[0].value;
      findUser.findUserByEmail(email).then((userFound) => {
        if (userFound) {
          // User has already logged in before
          loginUser.loginWithOAuth({ email }).then((userLoggedIn) => cb(null, userLoggedIn));
        } else {
          // New user
          addUser.addWithOAuth({ email, fullName: profile.displayName }).then((userAdded) => cb(null, userAdded));
        }
      }).catch((err) => cb(err));
    } else {
      cb(new AuthenticationError('Could not fetch emails from Google'));
    }
  }));
}

function initializeYoutubeStrategy() {
  passport.use(new YoutubeStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${config.baseDomain}/api/auth/youtube/redirect`,
    scope: ['https://www.googleapis.com/auth/youtube.readonly'],
  }, (accessToken: string, refreshToken: string, profile: any, done: Function) => {
    console.log(profile);
    done(null, true);
  }));
}

export default function initializePassport(app: Express) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: any, done) => {
    done(null, user.userId);
  });

  passport.deserializeUser((userId: string, done) => {
    findUser.findUserById(userId).then((user) => {
      done(null, user);
    });
  });

  initializeLocalStrategy();
  initializeGoogleStrategy();
  initializeYoutubeStrategy();

  app.post('/user/login', localAuthenticationMiddleware);
  app.post('/user/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      return res.status(HTTPResponseCode.OK).json({});
    });
  });

  app.get('/user/login/google', passport.authenticate('google'));
  app.get('/auth/google/redirect',
    passport.authenticate('google', { failureRedirect: '/error', failureMessage: true }),
    (req, res) => {
      // TODO: redirect Creator to /creator
      res.redirect('/feed');
    });

  app.get('/social/connect/youtube', passport.authenticate('youtube', { session: false }));
  app.get('/auth/youtube/redirect',
    passport.authenticate('youtube', { failureRedirect: '/error', failureMessage: true, session: false }),
    (req, res) => {
      res.redirect('/creator/start');
    });
}

export function authorizationMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  return res.status(HTTPResponseCode.UNAUTHORIZED).json({});
}
