import {Request, Response, NextFunction} from 'express';

// Check it user is authentication.
export function checkIfAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req['user']) {
    next();
  }
  else {
    res.sendStatus(403);
  }
}
