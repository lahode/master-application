import { IEnvironment } from "./env-model";
const root = require('app-root-path').path;

export const prodVariables:IEnvironment = {
  environmentName: 'Production Environment',
  APPNAME: 'Master Application',
  DATABASE: {
    USERS: `${root}/data/users.json`,
    ROLES: `${root}/data/roles.json`,
    FILES: `${root}/data/files.json`,
  },
  LOGNAME: 'LOG_MASTER_PROD',
  FRONTEND: 'https://localhost:4200',
  UPLOAD_DIRECTORY: `${root}/uploads`,
  PORT: 4300,
  SOCKET_ACTIVE: false,
  SECURITY: {
    HTTPS: true,
    KEY: `${root}/security/key.pem`,
    CERT: `${root}/security/cert.pem`
  },
  AUTH: {
    algorithm: 'RS256',
    expire: 7200,
    domain: '' // auth0 domain name
  },
  MAILER: {
    host: '',
    port: 587,
    secure: false,
    auth: {
      user: '',
      pass: ''
    },
    sender: ''
  }
};
