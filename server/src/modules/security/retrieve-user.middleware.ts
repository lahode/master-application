import { decodeJwt } from "./security.utils";
import { Request, Response, NextFunction } from 'express';

export class RetrieveUser {

  // Get the user payload.
  public static getUserPayload(req: Request, res: Response, next: NextFunction) {
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization, decoded;
      let header = (authorization as string).split(' ');
      if (header[0] === 'Bearer') {
        RetrieveUser.handleUserSession(header[1], req, res)
        .then(() => next())
        .catch((err: any) => {
            // TODO
            next();
        });
      }
    }
    else {
      next();
    }
  }

  // Decode the token and attach it's payload to req['user'].
  public static async handleUserSession(jwt:string, req: Request, res: Response) {
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
