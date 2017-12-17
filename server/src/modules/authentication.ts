import { verify } from 'jsonwebtoken';
import { CONFIG } from "../config";

// Export the authentication class
export class Authentication {
  public static checkAuthentication(req, cb: (isAuth: boolean|any) => void): void {
    // look for the token in the incoming request:
    let token;
    if (req.headers.authorization) {
      let header = req.headers.authorization.split(' ');
      try {
        token = JSON.parse(header[1]);
      } catch (e) {
        token = header[1];
      }
    }

    if (token === undefined) {
      // there is no token!
      cb(false);
    } else {
      verify(token, CONFIG.SECRET_TOKEN_KEY,  (err: Error, token: any): void => {
        if (err) {
          // Token exists but an error has been found
          cb(false);
        } else {
          // Token success
          cb({success:true, user: token});
        }
      });
    }
  }

  // Prepare authenticated route
  public static authenticatedRoute(req, res, next): void {
    Authentication.checkAuthentication(req,  (isAuth: boolean|any): void =>{
      if (isAuth) {
        next();
      } else {
        res.status(403).json({
          message: "Erreur d'accès, vous devez vous identifier",
          success: false
        });
      }
    });
  }
}
