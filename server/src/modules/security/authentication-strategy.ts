import { Response } from 'express';
import * as argon2 from 'argon2';

import { createCsrfToken, createSessionToken } from './security.utils';
import { User } from '../models/user';

export class AuthStrategy {

  /* Login strategy */
  public static async login(passwordInput:string, user:User,  res: Response) {
    try {
      const sessionToken = await AuthStrategy.attemptLogin(passwordInput, user);
      const csrfToken = await createCsrfToken();
      // res.cookie("SESSIONID", sessionToken, {httpOnly:true, secure:true}); TEMPORARY DISABLED
      res.cookie("SESSIONID", sessionToken);
      res.cookie("XSRF-TOKEN", csrfToken);
      return user;
    }
    catch(err) {
      return Promise.reject({message: "Erreur d'authentification.", status: 403})
    }
  }

  /* Verify password and create session token */
  public static async attemptLogin(passwordInput:string, user:User) {
    const isPasswordValid = await argon2.verify(user.password, passwordInput);
    if (!isPasswordValid) {
      throw new Error("Password Invalid");
    }
    return createSessionToken(user);
  }

  /* Signup strategy */
  public static async signup(user:User, res:Response) {
    const sessionToken = await createSessionToken(user);
    const csrfToken = await createCsrfToken();
    res.cookie("SESSIONID", sessionToken, {httpOnly:true, secure:true});
    res.cookie("XSRF-TOKEN", csrfToken);
    return user;
  }

  /* Logout strategy */
  public static logout(res) {
    res.clearCookie("SESSIONID");
    res.clearCookie("XSRF-TOKEN");
  }

}
