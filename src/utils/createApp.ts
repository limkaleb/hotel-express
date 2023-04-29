import { config } from 'dotenv';
import express, { Express } from 'express';
import cors from 'cors';
import session from 'express-session';
import routes from '../routes';
import passport from 'passport';
config();
require('../strategies/local');

export function createApp(): Express {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded());

  // Enable CORS
  app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }));

  app.use(session({
    secret: 'EIOHJGKDFJKHDGHJK',
    resave: false,
    saveUninitialized: false,
    cookie: {
      // secure: true,
      maxAge:60000 * 60 * 24 * 7,
    },
  }))

  // Enable Passport
  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/api', routes);
  return app;
}