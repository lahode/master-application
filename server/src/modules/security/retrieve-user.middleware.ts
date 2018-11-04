import { decodeJwt } from "./security.utils";
import { Request, Response, NextFunction } from 'express';

export class RetrieveUser {

  public static getUser(req: Request, res: Response, next: NextFunction) {
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization, decoded;
      let header = (authorization as string).split(' ');
      RetrieveUser.handleSession(header[1], req, res)
        .then(() => next())
        .catch(err => {
          // TODO
          next();
      });
    }
    else {
      next();
    }
  }

  public static async handleSession(jwt:string, req: Request, res: Response) {
    try {
      const payload = await decodeJwt(jwt);
      req["user"] = payload;
    }
    catch(err) {
      console.log("Error: Could not extract user from request:", err.message);
      return Promise.reject();
    }
  }
}
