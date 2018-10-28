const util = require('util');
const crypto = require('crypto');
import * as jwt from 'jsonwebtoken';
import * as fs from "fs";
import * as jwksClient from 'jwks-rsa';
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
    algorithm: CONFIG.AUTH.value['algorithm'],
    expiresIn: CONFIG.AUTH.value['expire'],
    subject: user.sub
  });
}

function getKey(header, callback) {
  let client = jwksClient({
    jwksUri: 'https://' + CONFIG.AUTH.value['domain'] + '/.well-known/jwks.json'
  });
  console.log('https://' + CONFIG.AUTH.value['domain'] + '/.well-known/jwks.json');
  client.getSigningKey(header.kid, (err, key) => {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

export async function decodeJwt(token:string) {
  if (CONFIG.AUTH.type == 'auth0') {
    return new Promise((resolve, reject) => {
      jwt.verify(token, getKey, [], (err, verified) => {
        if (err) return reject(err)
        resolve(verified)
      })
    });
  } else {
    return await jwt.verify(token, RSA_PUBLIC_KEY);
  }
}
