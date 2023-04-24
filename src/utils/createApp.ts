import { config } from 'dotenv';
import express, { Express } from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieSession from 'cookie-session';
import routes from '../routes';
import sessionFileStore from 'session-file-store';
import passport from 'passport';
config();
require('../strategies/local');

export function createApp(): Express {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded());

  // let FileStore = sessionFileStore(session)

  // Enable CORS
  app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }));

  app.use(function(req: any, res: any, next: any) {
    if (req.session && !req.session.regenerate) {
      req.session.regenerate = (cb: any) => {
        cb()
      }
    }
    if (req.session && !req.session.save) {
      req.session.save = (cb: any) => {
        cb()
      };
    }
    next()
})

  // app.use(session({
  //   secret: 'EIOHJGKDFJKHDGHJK',
  //   resave: false,
  //   saveUninitialized: false,
  //   cookie: { maxAge:60000 * 60 * 24 * 7 },
  //   store: new FileStore(),
  // }))

  app.use(cookieSession({
    maxAge: 60000 * 60 * 24 * 7,
    keys: ['WEREFDG'],
  }))

  // Enable Passport
  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/api', routes);
  return app;
}