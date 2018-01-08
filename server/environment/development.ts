import { IEnvironment } from "./env-model";
const root = require('app-root-path').path;

export const devVariables:IEnvironment = {
  environmentName: 'Development Environment',
  SECRET_TOKEN_KEY: 'this is a bad secret sentence',
  BCRYPT_ROUND: 10,
  PASSWORD_MIN_LENGHT: 6,
  JWT_EXPIRE: 86400000,
  DATABASE: {
    USERS: `${root}/data/users.json`,
    ROLES: `${root}/data/roles.json`,
    FILES: `${root}/data/files.json`
  },
  FRONTEND: 'https://localhost:4200',
  UPLOAD_DIRECTORY: `${root}/uploads`,
  PORT: 4300,
  SECURITY: {
    HTTPS: true,
    KEY: `${root}/security/key.pem`,
    CERT: `${root}/security/cert.pem`
  },
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
