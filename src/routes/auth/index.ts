import { Router } from "express";
import { PrismaClient } from '@prisma/client';
import passport from "passport";
import { isAuthenticated } from '../../utils/middleware';

const prisma = new PrismaClient();

const router = Router();

router.post('/local', passport.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

router.get('/failed', (req, res) => {
  // console.log('req.session: ', req.session);
  console.log('here failed..')
  res.send('FAILED');
});

router.post(
  '/signup',
  passport.authenticate('signup', {
    failureRedirect: "/api/auth/failed",
    // successRedirect: `success?message=success!%20You%20signed%20up!`,
  }),
  (req, res) => {
    console.log('here..')
    res.sendStatus(200);
  }
);

router.post(
  '/login',
  passport.authenticate('login', {
    failureRedirect: '/api/auth/failed',
    // successRedirect: `success?message=success!%20You%20signed%20up!`,
  }),
  (req, res) => {
    res.sendStatus(200);
  }
);

router.get('/status', isAuthenticated, (req, res) => {
  return req.user ? res.send(req.user) : res.status(401).send({
    msg: 'Unauthorized',
  });
})

export default router;