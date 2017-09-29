import * as path from 'path';

import { devVariables } from '../../../environment/development';
//import { prodVariables } from '../../../environment/production';
import { IEnvironment } from '../../../environment/env-model';

declare const process: any; // Typescript compiler will complain without this

export function environmentConfig():any {
  let env = devVariables;
  //if(process.env.NODE_ENV === 'prod'){env = prodVariables}
  return env;
}
export const SECRET_TOKEN_KEY: string = 'this is a bad secret sentence';
export const BCRYPT_ROUND: number = 10;
export const PASSWORD_MIN_LENGHT: number = 6;
export const JWT_EXPIRE: number = 86400000;
export const USERS_FILE: string = path.join(__dirname, '../../../../data/users.json');
export const MAILER: any = {
  host: '',
  port: 587,
  secure: false,
  auth: {
    user: '',
    pass: ''
  }
}
