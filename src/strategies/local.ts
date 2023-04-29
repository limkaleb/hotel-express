import passport from "passport";
import { Strategy, VerifyFunction } from 'passport-local';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

passport.serializeUser((user: any, done) => {
  return done(null, user.id);
})

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    })
    return user ? done(null, user) : done(null, null);
  } catch (error) {
    console.log(error);
    return done(error, null);
  }
})

const signupUser = async (userName: string, passwordInputted: string, done: Function) => {
  try {
    if (passwordInputted.length <= 4 || !userName) { // TODO: more password validations
      done(null, false, {
        message: "Your credentials do not match our criteria..",
      });
    } else {
      const hashedPass = await bcrypt.hash(passwordInputted, 10);
      const newUser = await prisma.user.create({
        data: { userName, password: hashedPass },
      });
      done(null, newUser);
    }
  } catch (error) {
    return done(error, null);
  }
}

const loginUser = async (userName: string, passwordInputted: string, done: Function) => {
  const user = await prisma.user.findUnique({
    where: { userName }
  })
  if (!user) {
    return done(null, false, { message: 'No user with that email' });
  }
  try {
    if (await bcrypt.compare(passwordInputted, user.password)) {
      return done(null, user);
    }
    return done(null, false, { message: 'Password incorrect' });
  } catch (error) {
    return done(error);
  }
};

passport.use('signup', new Strategy({
  usernameField: 'userName',
  passwordField: 'password'
}, signupUser as VerifyFunction));

passport.use('login', new Strategy({
  usernameField: 'userName',
  passwordField: 'password'
}, loginUser as VerifyFunction));