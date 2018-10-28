import { IEnvironment } from "./env-model";
const root = require('app-root-path').path;

export const devVariables:IEnvironment = {
  environmentName: 'Development Environment',
  DATABASE: {
    USERS: `${root}/data/users.json`,
    ROLES: `${root}/data/roles.json`,
    FILES: `${root}/data/files.json`
  },
  FRONTEND: 'http://localhost:4200',
  UPLOAD_DIRECTORY: `${root}/uploads`,
  PORT: 4300,
  SECURITY: {
    HTTPS: false,
    KEY: `${root}/security/key.pem`,
    CERT: `${root}/security/cert.pem`,
  },
  AUTH: {
    /*
    type: 'token',
    value : {
      algorithm: 'RS256',
      expire: 7200
    }
    */
    type: 'auth0',
    value : {
      domain: '' // auth0 domain name
    }
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
