import { Response } from 'express';
import * as argon2 from 'argon2';

import { decodeJwt } from "./security.utils";
import { createSessionToken } from './security.utils';
import { User } from '../api/users/user';

export class AuthStrategyToken {

  // Login strategy.
  public static async login(passwordInput:string, user:User, res: Response) {
    try {
      const token = await AuthStrategyToken.attemptLogin(passwordInput, user);
      return {user, token};
    }
    catch(err) {
      return Promise.reject({message: "Erreur d'authentification.", status: 403})
    }
  }

  // Verify password and create session token.
  public static async attemptLogin(passwordInput:string, user:User) {
    const isPasswordValid = await argon2.verify(user.password, passwordInput);
    if (!isPasswordValid) {
      throw new Error("Password Invalid");
    }
    return createSessionToken(user);
  }

  // Signup strategy.
  public static async signup(user:User, expiresIn = null) {
    const token = await createSessionToken(user, expiresIn);
    return {user, token};
  }

  // Retrieve the payload in a token.
  public static async getPayloadByToken(jwt:string) {
    const payload = await decodeJwt(jwt);
    return payload;
  }

  // Logout strategy.
  public static logout(res) {}

}
