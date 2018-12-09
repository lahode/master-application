import { IEnvironment } from './env-model';

export const environment: IEnvironment = {
  production: true,
  homepage: '/home',
  server: 'http://localhost:4300',
  authentication: {
    type: 'token',
    value : {}
  },
  socket: false,
  emailNotification: true
};
