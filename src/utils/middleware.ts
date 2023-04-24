import { NextFunction, Request, Response } from "express";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.user);
  if (req.user) {
    next();
  } else {
    return res.status(403).send('Unauthorized');
  }
};