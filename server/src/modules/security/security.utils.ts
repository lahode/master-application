const moment = require('moment');
const util = require('util');
const crypto = require('crypto');
import * as jwt from 'jsonwebtoken';
import * as fs from "fs";
import * as argon2 from 'argon2';
import { User } from "../models/user";
import { CONFIG } from "../../config";

export const randomBytes = util.promisify(crypto.randomBytes);
export const signJwt = util.promisify(jwt.sign);
const RSA_PRIVATE_KEY = fs.readFileSync(CONFIG.SECURITY.KEY);
const RSA_PUBLIC_KEY = fs.readFileSync(CONFIG.SECURITY.CERT);
const SESSION_DURATION = 1000;

/* Create a session token */
export async function createSessionToken(user: User) {
  return signJwt({
      roles: user.roles
    },
    RSA_PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: 7200,
    subject: user._id.toString()
  });
}

export async function decodeJwt(token:string) {
  return await jwt.verify(token, RSA_PUBLIC_KEY);
}
