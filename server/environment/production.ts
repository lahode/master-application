import { IEnvironment } from "./env-model";
const root = require('app-root-path').path;

export const prodVariables:IEnvironment = {
  environmentName: 'Production Environment',
  SECRET_TOKEN_KEY: 'this is a bad secret sentence',
  BCRYPT_ROUND: 10,
  PASSWORD_MIN_LENGHT: 6,
  JWT_EXPIRE: 86400000,
  USERS_FILE: `${root}/data/users.json`,
  PORT: 4400,
  MAILER: {
    host: '',
    port: 587,
    secure: false,
    auth: {
      user: '',
      pass: ''
    }
  }
};
