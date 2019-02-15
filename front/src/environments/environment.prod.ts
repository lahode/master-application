import { IEnvironment } from './env-model';

export const environment: IEnvironment = {
  production: true,
  homepage: '/home',
  server: 'https://localhost:4301',
  authentication: {
    type: 'auth0',
    value : {
      callback: 'http://localhost:4200/callback', // callback URL
      domain: '',  // auth0 domain name
      client_id: ''  // client ID
    }
  },
  socket: false,
  emailNotification: true
};
