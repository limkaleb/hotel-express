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
  console.log('req.session: ', req.session);
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
  console.log('requser: ', req.user)
  return req.user ? res.send(req.user) : res.status(401).send({
    msg: 'Unauthorized',
  });
})

router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    // return res.sendStatus(201);
    // res.redirect('/')
    res.sendStatus(200);
  });
});

export default router;
