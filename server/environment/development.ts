import { IEnvironment } from "./env-model";
const root = require('app-root-path').path;
const args = require('minimist')(process.argv.slice(2)) || [];

export const devVariables:IEnvironment = {
  environmentName: 'Development Environment',
  APPNAME: 'Master Application',
  LOGNAME: 'LOG_MASTER_DEV',
  FRONTEND: args['FRONTPATH'] || 'http://localhost:4200',
  UPLOAD_DIRECTORY: '/uploads',
  PORT: args['PORT'] || '4300',
  SOCKET_ACTIVE: false,
  SECURITY: {
    HTTPS: false,
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
  MONGODB: args['MONGODB'] || 'mongodb://localhost:27017/master-dev',
};
