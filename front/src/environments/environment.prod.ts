import { IEnvironment } from './env-model';

export const environment: IEnvironment = {
  production: true,
  homepage: '/home',
  authentication: {
    type: 'token',
    value : {}
  },
  socket: {
    baseUrl: '',
    config: {}
  }
};
