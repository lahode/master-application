import { IEnvironment } from "./env-model";
import * as env from 'env-var';

const root = require('app-root-path').path;

export const prodVariables:IEnvironment = {
  environmentName: 'Production Environment',
  APPNAME: 'Master Application',
  LOGNAME: 'LOG_MASTER_PROD',
  FRONTEND: env.get('FRONTPATH', '*').asString(),
  UPLOAD_DIRECTORY: '/uploads',
  PORT: env.get('PORT', '4444').asIntPositive(),
  SOCKET_ACTIVE: false,
  PROXY: '',
  REDIS: {
    host: env.get('REDIS_HOST', 'localhost').asString(),
    port: env.get('REDIS_PORT', '6379').asIntPositive(),
    active: false
  },
  SECURITY: {
    KEY: `${root}/security/key.pem`,
    CERT: `${root}/security/cert.pem`,
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
  },
  MONGODB: env.get('MONGODB', 'mongodb://localhost:27017/master-prod').asString(),
};
