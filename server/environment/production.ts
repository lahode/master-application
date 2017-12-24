import { IEnvironment } from "./env-model";
const root = require('app-root-path').path;

export const prodVariables:IEnvironment = {
  environmentName: 'Production Environment',
  SECRET_TOKEN_KEY: 'this is a bad secret sentence',
  BCRYPT_ROUND: 10,
  PASSWORD_MIN_LENGHT: 6,
  JWT_EXPIRE: 86400000,
  DATABASE: {
    USERS: `${root}/data/users.json`,
    FILES: `${root}/data/files.json`,
  },
  UPLOAD_DIRECTORY: `${root}/uploads`,
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
