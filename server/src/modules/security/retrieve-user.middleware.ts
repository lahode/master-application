import { decodeJwt } from "./security.utils";
import { Request, Response, NextFunction } from 'express';

export class RetrieveUser {

  public static getUser(req: Request, res: Response, next: NextFunction) {
    const jwt = req.cookies["SESSIONID"];
    if (jwt) {
      RetrieveUser.handleSessionCookie(jwt, req)
        .then(() => next())
        .catch(err => {
          next();
      })
    }
    else {
      next();
    }
  }

  public static async handleSessionCookie(jwt:string, req: Request) {
    try {
      const payload = await decodeJwt(jwt);
      req["user"] = payload;
    }
    catch(err) {
      console.log("Error: Could not extract user from request:", err.message);
    }
  }
}
