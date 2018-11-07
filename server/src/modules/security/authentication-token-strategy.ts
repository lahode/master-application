import { Response } from 'express';
import * as argon2 from 'argon2';

import { createSessionToken } from './security.utils';
import { User } from '../models/user';

export class AuthStrategyToken {

  // Login strategy.
  public static async login(passwordInput:string, user:User,  res: Response) {
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
  public static async signup(user:User, res:Response) {
    const token = await createSessionToken(user);
    return {user, token};
  }

  // Logout strategy.
  public static logout(res) {}

}
