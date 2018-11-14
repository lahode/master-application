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

// Create a session token.
export async function createSessionToken(user: User, expiresIn = null) {
  return signJwt({
      roles: user.roles
    },
    RSA_PRIVATE_KEY, {
    algorithm: CONFIG.AUTH.algorithm || 'RS256',
    expiresIn: expiresIn ? expiresIn : (CONFIG.AUTH.expire || 7200),
    subject: user.sub
  });
}

// Get key for auth0 authentication.
function getKey(header, callback) {
  let client = jwksClient({
    jwksUri: 'https://' + CONFIG.AUTH.domain + '/.well-known/jwks.json'
  });
  client.getSigningKey(header.kid, (err, key) => {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// Decode JWT token.
export async function decodeJwt(token:string) {
  try {
    const tokenPart = token.split('|');
    switch (tokenPart[1]) {
      case 'jwt' :
        return await jwt.verify(tokenPart[0], RSA_PUBLIC_KEY);
      case 'auth0' :
        return new Promise((resolve, reject) => {
          jwt.verify(tokenPart[0], getKey, [], (err, verified) => {
            if (err) return reject(err)
            resolve(verified)
          })
        });
    }
  }
  catch(e) {
    throw('Invalid token');
  }
}
